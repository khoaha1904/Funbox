import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '@libs/shared/services';
import { AuthService } from '../services/auth.service';
import { UserDto } from '@apps/modules/users/dtos/user.dto';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';

@Injectable()
export class JwtLocalStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly _configService: AppConfigService,
		private readonly _authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: _configService.get('JWT_SECRET'),
		});
	}

	async validate(user: UserDto) {
		try {
			const user_result = await this._authService.validateUser(user?.id);
			return user_result;
		} catch (err) {
			throw new UnauthorizedException(ResponseDescription.UNAUTHORIZED);
		}
	}
}
