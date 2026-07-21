import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';

interface LocationUpdate {
  favorId: string;
  lat: number;
  lng: number;
}

// Seguimiento GPS en tiempo real: el Yanapayer emite su ubicación
// y el cliente suscrito a la sala del favor la recibe al instante.
@WebSocketGateway({ namespace: '/tracking', cors: { origin: '*' } })
export class TrackingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly tracking: TrackingService) {}

  handleConnection(client: Socket) {
    const favorId = client.handshake.query.favorId as string | undefined;
    if (favorId) client.join(`favor:${favorId}`);
  }

  @SubscribeMessage('location:update')
  async onLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LocationUpdate,
  ) {
    await this.tracking.addPoint(data.favorId, data.lat, data.lng);
    this.server.to(`favor:${data.favorId}`).emit('location:changed', {
      favorId: data.favorId,
      lat: data.lat,
      lng: data.lng,
      at: new Date().toISOString(),
    });
  }
}
