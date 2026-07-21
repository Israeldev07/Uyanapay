import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoTransaccion, Prisma, TipoTransaccion } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 30, include: { favor: { select: { code: true, title: true } } } },
      },
    });
    if (!wallet) throw new NotFoundException('Billetera no encontrada');
    return wallet;
  }

  // Recarga de saldo (en producción se integra con la pasarela de pagos)
  async topUp(userId: string, amount: number, reference?: string) {
    if (amount <= 0) throw new BadRequestException('Monto inválido');
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TipoTransaccion.RECARGA,
          amount: new Prisma.Decimal(amount),
          reference,
        },
      });
      return tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      });
    });
  }

  // Retiro a cuenta bancaria: se descuenta y queda pendiente de dispersión
  async withdraw(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Monto inválido');
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      if (wallet.balance.lt(amount)) {
        throw new BadRequestException('Saldo insuficiente');
      }
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TipoTransaccion.RETIRO,
          status: EstadoTransaccion.PENDIENTE,
          amount: new Prisma.Decimal(amount).neg(),
        },
      });
      return tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          pendingBalance: { increment: amount },
        },
      });
    });
  }
}
