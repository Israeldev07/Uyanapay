import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavorStatus, MetodoPago, Prisma, Role, TipoTransaccion } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavorDto } from './dto/create-favor.dto';
import { JwtUser } from '../common/current-user.decorator';

const COMMISSION_RATE = Number(process.env.COMMISSION_RATE ?? 0.1);

// Transiciones válidas de la máquina de estados de un favor
const TRANSITIONS: Record<FavorStatus, FavorStatus[]> = {
  PUBLICADO: [FavorStatus.ACEPTADO, FavorStatus.CANCELADO],
  ACEPTADO: [FavorStatus.EN_CAMINO, FavorStatus.CANCELADO],
  EN_CAMINO: [FavorStatus.ENTREGADO, FavorStatus.CANCELADO],
  ENTREGADO: [FavorStatus.FINALIZADO],
  FINALIZADO: [],
  CANCELADO: [],
};

@Injectable()
export class FavorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, dto: CreateFavorDto) {
    const category = await this.prisma.category.findUnique({
      where: { slug: dto.categorySlug },
    });
    if (!category || !category.isActive) {
      throw new BadRequestException('Categoría inválida');
    }

    let couponId: string | undefined;
    let budget = new Prisma.Decimal(dto.budget);

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      const expired = coupon?.expiresAt && coupon.expiresAt < new Date();
      if (!coupon || !coupon.isActive || expired || coupon.usedCount >= coupon.maxUses) {
        throw new BadRequestException('Cupón inválido o agotado');
      }
      couponId = coupon.id;
      budget = budget.mul(100 - coupon.discountPct).div(100).toDecimalPlaces(2);
    }

    const commission = budget.mul(COMMISSION_RATE).toDecimalPlaces(2);
    const count = await this.prisma.favorRequest.count();

    return this.prisma.$transaction(async (tx) => {
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }
      return tx.favorRequest.create({
        data: {
          code: `UY-${String(count + 1).padStart(6, '0')}`,
          clientId,
          categoryId: category.id,
          title: dto.title,
          description: dto.description,
          photoUrls: dto.photoUrls ?? [],
          originLabel: dto.originLabel,
          originLat: dto.originLat,
          originLng: dto.originLng,
          destLabel: dto.destLabel,
          destLat: dto.destLat,
          destLng: dto.destLng,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
          urgency: dto.urgency,
          budget,
          paymentMethod: dto.paymentMethod,
          notes: dto.notes,
          commission,
          total: budget,
          couponId,
          conversation: { create: {} },
        },
        include: { category: true },
      });
    });
  }

  findMine(user: JwtUser, status?: FavorStatus) {
    const where: Prisma.FavorRequestWhereInput =
      user.role === Role.YANAPAYER
        ? { yanapayerId: user.id, ...(status && { status }) }
        : { clientId: user.id, ...(status && { status }) };
    return this.prisma.favorRequest.findMany({
      where,
      include: { category: true, client: this.publicUser(), yanapayer: this.publicUser() },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Solicitudes disponibles para Yanapayers (feed de "solicitudes cercanas")
  findAvailable() {
    return this.prisma.favorRequest.findMany({
      where: { status: FavorStatus.PUBLICADO },
      include: { category: true, client: this.publicUser() },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });
  }

  async findOne(id: string, user: JwtUser) {
    const favor = await this.prisma.favorRequest.findUnique({
      where: { id },
      include: {
        category: true,
        client: this.publicUser(),
        yanapayer: this.publicUser(),
        tracking: { orderBy: { createdAt: 'desc' }, take: 20 },
        ratings: true,
      },
    });
    if (!favor) throw new NotFoundException('Favor no encontrado');
    const involved =
      favor.clientId === user.id || favor.yanapayerId === user.id || user.role === Role.ADMIN;
    const open = favor.status === FavorStatus.PUBLICADO && user.role === Role.YANAPAYER;
    if (!involved && !open) throw new ForbiddenException('Sin acceso a este favor');
    return favor;
  }

  // Un Yanapayer verificado acepta un favor publicado
  async accept(favorId: string, yanapayerId: string) {
    const profile = await this.prisma.yanapayerProfile.findUnique({
      where: { userId: yanapayerId },
    });
    if (!profile || profile.verification !== 'APROBADO') {
      throw new ForbiddenException('Tu perfil de Yanapayer aún no está verificado');
    }

    // updateMany con filtro de estado evita que dos Yanapayers acepten a la vez
    const result = await this.prisma.favorRequest.updateMany({
      where: { id: favorId, status: FavorStatus.PUBLICADO },
      data: { yanapayerId, status: FavorStatus.ACEPTADO, acceptedAt: new Date() },
    });
    if (result.count === 0) {
      throw new BadRequestException('El favor ya no está disponible');
    }
    return this.prisma.favorRequest.findUnique({
      where: { id: favorId },
      include: { category: true, client: this.publicUser() },
    });
  }

  async updateStatus(favorId: string, user: JwtUser, next: FavorStatus, reason?: string) {
    const favor = await this.prisma.favorRequest.findUnique({ where: { id: favorId } });
    if (!favor) throw new NotFoundException('Favor no encontrado');

    const isClient = favor.clientId === user.id;
    const isWorker = favor.yanapayerId === user.id;
    if (!isClient && !isWorker && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Sin acceso a este favor');
    }
    if (!TRANSITIONS[favor.status].includes(next)) {
      throw new BadRequestException(`Transición inválida: ${favor.status} → ${next}`);
    }
    // EN_CAMINO/ENTREGADO las marca el Yanapayer; FINALIZADO y CANCELADO el cliente (o admin)
    if ([FavorStatus.EN_CAMINO, FavorStatus.ENTREGADO].includes(next as any) && !isWorker) {
      throw new ForbiddenException('Solo el Yanapayer puede actualizar este estado');
    }
    if (next === FavorStatus.FINALIZADO && !isClient && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Solo el cliente puede finalizar el favor');
    }

    const timestamps: Prisma.FavorRequestUpdateInput = {
      status: next,
      ...(next === FavorStatus.EN_CAMINO && { startedAt: new Date() }),
      ...(next === FavorStatus.ENTREGADO && { deliveredAt: new Date() }),
      ...(next === FavorStatus.FINALIZADO && { completedAt: new Date() }),
      ...(next === FavorStatus.CANCELADO && { cancelledAt: new Date(), cancelReason: reason }),
    };

    if (next !== FavorStatus.FINALIZADO) {
      return this.prisma.favorRequest.update({ where: { id: favorId }, data: timestamps });
    }
    return this.settle(favor.id, timestamps);
  }

  // Liquidación ACID: cobra al cliente, paga al Yanapayer y registra la comisión
  private async settle(favorId: string, timestamps: Prisma.FavorRequestUpdateInput) {
    return this.prisma.$transaction(async (tx) => {
      const favor = await tx.favorRequest.findUniqueOrThrow({ where: { id: favorId } });
      if (!favor.yanapayerId) throw new BadRequestException('Favor sin Yanapayer asignado');

      const clientWallet = await tx.wallet.findUniqueOrThrow({
        where: { userId: favor.clientId },
      });
      const workerWallet = await tx.wallet.findUniqueOrThrow({
        where: { userId: favor.yanapayerId },
      });

      const total = favor.total;
      const earning = total.sub(favor.commission);

      if (favor.paymentMethod === MetodoPago.SALDO) {
        if (clientWallet.balance.lt(total)) {
          throw new BadRequestException('Saldo insuficiente para finalizar el favor');
        }
        await tx.wallet.update({
          where: { id: clientWallet.id },
          data: { balance: { decrement: total } },
        });
        await tx.transaction.create({
          data: {
            walletId: clientWallet.id,
            favorId,
            type: TipoTransaccion.PAGO_FAVOR,
            amount: total.neg(),
            reference: favor.code,
          },
        });
      }

      await tx.wallet.update({
        where: { id: workerWallet.id },
        data: { balance: { increment: earning } },
      });
      await tx.transaction.create({
        data: {
          walletId: workerWallet.id,
          favorId,
          type: TipoTransaccion.GANANCIA,
          amount: earning,
          reference: favor.code,
        },
      });
      await tx.transaction.create({
        data: {
          walletId: workerWallet.id,
          favorId,
          type: TipoTransaccion.COMISION,
          amount: favor.commission.neg(),
          reference: `Comisión ${favor.code}`,
        },
      });

      await tx.yanapayerProfile.update({
        where: { userId: favor.yanapayerId },
        data: { completedCount: { increment: 1 } },
      });

      return tx.favorRequest.update({ where: { id: favorId }, data: timestamps });
    });
  }

  private publicUser() {
    return {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        career: true,
        avatarUrl: true,
        yanapayerProfile: {
          select: { ratingAvg: true, ratingCount: true, level: true, transport: true },
        },
      },
    } as const;
  }
}
