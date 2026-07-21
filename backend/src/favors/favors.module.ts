import { Module } from '@nestjs/common';
import { FavorsController } from './favors.controller';
import { FavorsService } from './favors.service';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [TrackingModule],
  controllers: [FavorsController],
  providers: [FavorsService],
  exports: [FavorsService],
})
export class FavorsModule {}
