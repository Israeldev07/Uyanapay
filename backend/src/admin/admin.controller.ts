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
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EstadoIncidente, FavorStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminService } from './admin.service';

class ActiveDto {
  @IsBoolean() isActive!: boolean;
}

class VerifyDto {
  @IsBoolean() approve!: boolean;
}

class ResolveDto {
  @IsString() @IsNotEmpty() resolution!: string;
}

class CouponDto {
  @IsString() @IsNotEmpty() code!: string;
  @IsInt() @Min(1) @Max(100) discountPct!: number;
  @IsInt() @Min(1) maxUses!: number;
  @IsOptional() @IsDateString() expiresAt?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('estadisticas')
  stats() {
    return this.admin.stats();
  }

  @Get('usuarios')
  users(@Query('role') role?: Role) {
    return this.admin.listUsers(role);
  }

  @Patch('usuarios/:id/activo')
  setActive(@Param('id') id: string, @Body() dto: ActiveDto) {
    return this.admin.setUserActive(id, dto.isActive);
  }

  @Get('verificaciones')
  verifications() {
    return this.admin.pendingVerifications();
  }

  @Patch('verificaciones/:profileId')
  verify(@Param('profileId') profileId: string, @Body() dto: VerifyDto) {
    return this.admin.verify(profileId, dto.approve);
  }

  @Get('solicitudes')
  favors(@Query('status') status?: FavorStatus) {
    return this.admin.listFavors(status);
  }

  @Get('incidentes')
  incidents(@Query('status') status?: EstadoIncidente) {
    return this.admin.listIncidents(status);
  }

  @Patch('incidentes/:id/resolver')
  resolve(@Param('id') id: string, @Body() dto: ResolveDto) {
    return this.admin.resolveIncident(id, dto.resolution);
  }

  @Get('cupones')
  coupons() {
    return this.admin.listCoupons();
  }

  @Post('cupones')
  createCoupon(@Body() dto: CouponDto) {
    return this.admin.createCoupon(
      dto.code,
      dto.discountPct,
      dto.maxUses,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }
}
