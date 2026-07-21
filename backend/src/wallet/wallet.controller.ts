import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { WalletService } from './wallet.service';

class AmountDto {
  @IsNumber() @IsPositive() amount!: number;
  @IsOptional() @IsString() reference?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('billetera')
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @Get()
  get(@CurrentUser() user: JwtUser) {
    return this.wallet.getWallet(user.id);
  }

  @Post('recargar')
  topUp(@CurrentUser() user: JwtUser, @Body() dto: AmountDto) {
    return this.wallet.topUp(user.id, dto.amount, dto.reference);
  }

  @Post('retirar')
  withdraw(@CurrentUser() user: JwtUser, @Body() dto: AmountDto) {
    return this.wallet.withdraw(user.id, dto.amount);
  }
}
