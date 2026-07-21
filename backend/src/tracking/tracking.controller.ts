import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@UseGuards(JwtAuthGuard)
@Controller('seguimiento')
export class TrackingController {
  constructor(private readonly tracking: TrackingService) {}

  @Get(':favorId')
  route(@Param('favorId') favorId: string) {
    return this.tracking.getRoute(favorId);
  }
}
