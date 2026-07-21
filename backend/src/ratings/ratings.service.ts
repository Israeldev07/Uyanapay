import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavorStatus, Prisma, TipoTransaccion } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Califica la contraparte de un favor finalizado; propina opcional.
  async rate(favorId: string, raterId: string, stars: number, comment?: string, tip?: number) {
    const favor = await this.prisma.favorRequest.findUnique({ where: { id: favorId } });
    if (!favor) throw new NotFoundException('Favor no encontrado');
    if (favor.status !== FavorStatus.FINALIZADO) {
      throw new BadRequestException('Solo se pueden calificar favores finalizados');
    }
    const isClient = favor.clientId === raterId;
    const isWorker = favor.yanapayerId === raterId;
    if (!isClient && !isWorker) throw new ForbiddenException('No participaste en este favor');

    const ratedId = isClient ? favor.yanapayerId! : favor.clientId;

    return this.prisma.$transaction(async (tx) => {
      const rating = await tx.rating.create({
        data: {
          favorId,
          raterId,
          ratedId,
          stars,
          comment,
          tip: tip ? new Prisma.Decimal(tip) : undefined,
        },
      });

      // La propina del cliente va directa a la billetera del Yanapayer
      if (isClient && tip && tip > 0) {
        const workerWallet = await tx.wallet.findUniqueOrThrow({
          where: { userId: ratedId },
        });
        await tx.wallet.update({
          where: { id: workerWallet.id },
          data: { balance: { increment: tip } },
        });
        await tx.transaction.create({
          data: {
            walletId: workerWallet.id,
            favorId,
            type: TipoTransaccion.PROPINA,
            amount: new Prisma.Decimal(tip),
            reference: favor.code,
          },
        });
      }

      // Actualiza el agregado de reputación del Yanapayer calificado
      if (isClient) {
        const agg = await tx.rating.aggregate({
          where: { ratedId },
          _avg: { stars: true },
          _count: true,
        });
        await tx.yanapayerProfile.updateMany({
          where: { userId: ratedId },
          data: {
            ratingAvg: new Prisma.Decimal(agg._avg.stars ?? 0).toDecimalPlaces(2),
            ratingCount: agg._count,
          },
        });
      }

      return rating;
    });
  }

  forUser(userId: string) {
    return this.prisma.rating.findMany({
      where: { ratedId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        rater: { select: { firstName: true, career: true, avatarUrl: true } },
        favor: { select: { code: true, title: true } },
      },
    });
  }
}
