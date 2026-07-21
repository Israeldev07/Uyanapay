import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FavorStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { CreateFavorDto } from './dto/create-favor.dto';
import { FavorsService } from './favors.service';

class UpdateStatusDto {
  @IsEnum(FavorStatus) status!: FavorStatus;
  @IsOptional() @IsString() reason?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('favores')
export class FavorsController {
  constructor(private readonly favors: FavorsService) {}

  @Post()
  @Roles(Role.CLIENTE, Role.ADMIN)
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateFavorDto) {
    return this.favors.create(user.id, dto);
  }

  @Get('mios')
  mine(@CurrentUser() user: JwtUser, @Query('status') status?: FavorStatus) {
    return this.favors.findMine(user, status);
  }

  @Get('disponibles')
  @Roles(Role.YANAPAYER, Role.ADMIN)
  available() {
    return this.favors.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.favors.findOne(id, user);
  }

  @Post(':id/aceptar')
  @Roles(Role.YANAPAYER)
  accept(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.favors.accept(id, user.id);
  }

  @Patch(':id/estado')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.favors.updateStatus(id, user, dto.status, dto.reason);
  }
}
