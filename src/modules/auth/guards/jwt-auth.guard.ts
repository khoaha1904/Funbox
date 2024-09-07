import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSessionDto } from '../dtos/user-session.dto';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
	constructor() {
		super();
	}

	handleRequest(err: any, data: UserSessionDto) {
		// You can throw an exception based on either "info" or "err" arguments

		if (err || !data) {
			throw err || new UnauthorizedException();
		}

		return data as any;
	}
}
