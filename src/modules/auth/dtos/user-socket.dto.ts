import { UserSessionDto } from "./user-session.dto";
import { Socket } from 'socket.io';

export class UserSocketDto extends Socket {
    user?: UserSessionDto
}
