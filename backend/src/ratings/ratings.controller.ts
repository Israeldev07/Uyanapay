import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { RatingsService } from './ratings.service';

class RateDto {
  @IsInt() @Min(1) @Max(5) stars!: number;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsNumber() @IsPositive() tip?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('calificaciones')
export class RatingsController {
  constructor(private readonly ratings: RatingsService) {}

  @Post('favor/:favorId')
  rate(
    @Param('favorId') favorId: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: RateDto,
  ) {
    return this.ratings.rate(favorId, user.id, dto.stars, dto.comment, dto.tip);
  }

  @Get('usuario/:userId')
  forUser(@Param('userId') userId: string) {
    return this.ratings.forUser(userId);
  }
}
