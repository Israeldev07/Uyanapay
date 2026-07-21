import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { UsersService } from './users.service';

class UpdateProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() career?: string;
  @IsOptional() @IsString() avatarUrl?: string;
}

class AvailabilityDto {
  @IsBoolean() isAvailable!: boolean;
}

class LocationDto {
  @IsNumber() lat!: number;
  @IsNumber() lng!: number;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.users.getProfile(user.id);
  }

  @Patch('me')
  update(@CurrentUser() user: JwtUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Patch('me/disponibilidad')
  availability(@CurrentUser() user: JwtUser, @Body() dto: AvailabilityDto) {
    return this.users.setAvailability(user.id, dto.isAvailable);
  }

  @Patch('me/ubicacion')
  location(@CurrentUser() user: JwtUser, @Body() dto: LocationDto) {
    return this.users.updateLocation(user.id, dto.lat, dto.lng);
  }
}
