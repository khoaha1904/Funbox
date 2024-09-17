import { Inject, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { AuthService } from '../auth/services/auth.service';
import { UserSocketDto } from '../auth/dtos/user-socket.dto';

@WebSocketGateway({ cors: true })
export class FacebookConversationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(AuthService) private readonly _authService: AuthService
    ) { }

    @WebSocketServer()
    server: Server

    async handleConnection(socket: UserSocketDto) {
        // const token = socket.handshake.auth.token;
        // if (!token) {
        //     socket.disconnect();
        //     return;
        // }

        // try {
        //     const user = await this._authService.verifyToken(token);
        //     socket.user = user; // Store the user in the socket instance
        //     // console.log(`Client connected: ${socket.id} (User: ${user.username})`);
        // } catch (error) {
        //     // console.log('Invalid token');
        //     socket.disconnect();
        // }
        // console.log(`Client connected: ${socket.id} (User: ${user?.username})`);

    }

    async handleDisconnect(socket: UserSocketDto) {
        console.log('Client disconnected:', socket.id);
    }

    // @SubscribeMessage('message')
    // handleMessage(
    //     @MessageBody() message: string,
    //     @ConnectedSocket() socket: UserSocketDto,
    // ): void {
    //     console.log('Message received:', message);
    //     this.server.emit('message', message); // Broadcast to all clients
    // }
}
