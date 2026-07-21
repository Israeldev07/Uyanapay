import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        university: true,
        yanapayerProfile: true,
        wallet: { select: { balance: true, pendingBalance: true } },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { passwordHash, ...profile } = user;
    return profile;
  }

  updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        career: true,
        avatarUrl: true,
      },
    });
  }

  async setAvailability(userId: string, isAvailable: boolean) {
    return this.prisma.yanapayerProfile.update({
      where: { userId },
      data: { isAvailable },
      select: { isAvailable: true },
    });
  }

  async updateLocation(userId: string, lat: number, lng: number) {
    return this.prisma.yanapayerProfile.update({
      where: { userId },
      data: { currentLat: lat, currentLng: lng },
      select: { currentLat: true, currentLng: true },
    });
  }
}
