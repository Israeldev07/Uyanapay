import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoMensaje } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { ChatService } from './chat.service';

class SendMessageDto {
  @IsEnum(TipoMensaje) type!: TipoMensaje;
  @IsString() @IsNotEmpty() content!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get('favor/:favorId')
  byFavor(@Param('favorId') favorId: string, @CurrentUser() user: JwtUser) {
    return this.chat.getByFavor(favorId, user.id);
  }

  @Post(':conversationId/mensajes')
  send(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: SendMessageDto,
  ) {
    return this.chat.sendMessage(conversationId, user.id, dto.type, dto.content);
  }

  @Post(':conversationId/leido')
  read(@Param('conversationId') conversationId: string, @CurrentUser() user: JwtUser) {
    return this.chat.markRead(conversationId, user.id);
  }
}
