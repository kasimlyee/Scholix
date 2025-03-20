import {
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendNotification')
  handleNotification(@MessageBody() message: string): void {
    this.server.emit('receiveNotification', message);
  }
}
