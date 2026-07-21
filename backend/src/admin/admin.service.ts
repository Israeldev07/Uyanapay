import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoIncidente, EstadoVerificacion, FavorStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Dashboard: estadísticas globales de la plataforma
  async stats() {
    const [users, yanapayers, favorsDone, favorsActive, ratingAgg, commissionAgg] =
      await Promise.all([
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.yanapayerProfile.count({ where: { verification: 'APROBADO' } }),
        this.prisma.favorRequest.count({ where: { status: FavorStatus.FINALIZADO } }),
        this.prisma.favorRequest.count({
          where: { status: { in: [FavorStatus.PUBLICADO, FavorStatus.ACEPTADO, FavorStatus.EN_CAMINO] } },
        }),
        this.prisma.rating.aggregate({ _avg: { stars: true } }),
        this.prisma.favorRequest.aggregate({
          where: { status: FavorStatus.FINALIZADO },
          _sum: { commission: true, total: true },
        }),
      ]);

    return {
      usuarios: users,
      yanapayers,
      serviciosRealizados: favorsDone,
      serviciosActivos: favorsActive,
      satisfaccion: ratingAgg._avg.stars
        ? Math.round((Number(ratingAgg._avg.stars) / 5) * 100)
        : null,
      comisionesTotales: commissionAgg._sum.commission ?? 0,
      volumenTotal: commissionAgg._sum.total ?? 0,
    };
  }

  listUsers(role?: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        university: { select: { name: true } },
        yanapayerProfile: {
          select: { verification: true, ratingAvg: true, completedCount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  setUserActive(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, isActive: true },
    });
  }

  // Cola de verificaciones de Yanapayers (cédula, carnet, verificación facial)
  pendingVerifications() {
    return this.prisma.yanapayerProfile.findMany({
      where: { verification: EstadoVerificacion.PENDIENTE },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, career: true } },
      },
    });
  }

  async verify(profileId: string, approve: boolean) {
    const profile = await this.prisma.yanapayerProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Perfil no encontrado');
    return this.prisma.yanapayerProfile.update({
      where: { id: profileId },
      data: {
        verification: approve ? EstadoVerificacion.APROBADO : EstadoVerificacion.RECHAZADO,
      },
    });
  }

  listFavors(status?: FavorStatus) {
    return this.prisma.favorRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        category: { select: { name: true } },
        client: { select: { firstName: true, lastName: true } },
        yanapayer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  listIncidents(status?: EstadoIncidente) {
    return this.prisma.incident.findMany({
      where: status ? { status } : undefined,
      include: {
        favor: { select: { code: true, title: true } },
        reporter: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  resolveIncident(id: string, resolution: string) {
    return this.prisma.incident.update({
      where: { id },
      data: { status: EstadoIncidente.RESUELTO, resolution },
    });
  }

  createCoupon(code: string, discountPct: number, maxUses: number, expiresAt?: Date) {
    return this.prisma.coupon.create({
      data: { code, discountPct, maxUses, expiresAt },
    });
  }

  listCoupons() {
    return this.prisma.coupon.findMany({ orderBy: { code: 'asc' } });
  }
}
