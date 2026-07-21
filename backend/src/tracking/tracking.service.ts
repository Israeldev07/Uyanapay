import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  addPoint(favorId: string, lat: number, lng: number) {
    return this.prisma.trackingPoint.create({ data: { favorId, lat, lng } });
  }

  getRoute(favorId: string) {
    return this.prisma.trackingPoint.findMany({
      where: { favorId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
