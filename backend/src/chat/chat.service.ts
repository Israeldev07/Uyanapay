import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoMensaje } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertParticipant(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { favor: { select: { clientId: true, yanapayerId: true } } },
    });
    if (!conversation) throw new NotFoundException('Conversación no encontrada');
    const { clientId, yanapayerId } = conversation.favor;
    if (userId !== clientId && userId !== yanapayerId) {
      throw new ForbiddenException('No participas en esta conversación');
    }
    return conversation;
  }

  async getByFavor(favorId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { favorId },
    });
    if (!conversation) throw new NotFoundException('Conversación no encontrada');
    await this.assertParticipant(conversation.id, userId);
    return this.prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, firstName: true, avatarUrl: true } } },
        },
      },
    });
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    type: TipoMensaje,
    content: string,
  ) {
    await this.assertParticipant(conversationId, senderId);
    return this.prisma.message.create({
      data: { conversationId, senderId, type, content },
      include: { sender: { select: { id: true, firstName: true, avatarUrl: true } } },
    });
  }

  async markRead(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }
}
