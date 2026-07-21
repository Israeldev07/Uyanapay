import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TipoMensaje } from '@prisma/client';
import { ChatService } from './chat.service';

interface ChatPayload {
  conversationId: string;
  senderId: string;
  type: TipoMensaje;
  content: string;
}

// Chat en tiempo real por favor (estilo WhatsApp: texto, imagen,
// documento, ubicación, audio). Persiste y difunde a la sala.
@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chat: ChatService) {}

  handleConnection(client: Socket) {
    const conversationId = client.handshake.query.conversationId as string | undefined;
    if (conversationId) client.join(`conv:${conversationId}`);
  }

  @SubscribeMessage('message:send')
  async onMessage(@ConnectedSocket() _client: Socket, @MessageBody() data: ChatPayload) {
    const message = await this.chat.sendMessage(
      data.conversationId,
      data.senderId,
      data.type,
      data.content,
    );
    this.server.to(`conv:${data.conversationId}`).emit('message:new', message);
  }
}
