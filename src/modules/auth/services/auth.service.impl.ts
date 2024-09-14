import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AppConfigService, AppLoggerService, UtilService } from '@libs/shared/services';
import {
	DEFAULT_ACCESS_TOKEN_EXPIRED,
	DEFAULT_REFRESH_TOKEN_EXPIRED,
	MAX_MAIL_VERIFY_SENDING,
} from '@apps/modules/auth/constants/auth.constants';
import { UserSessionDto } from '../dtos/user-session.dto';
import { toPlainObject } from 'lodash';
import { UsersService } from '@apps/modules/users/services/user.service';
import { AuthCacheService } from '../cache/auth-cache.service';
import { RegisterRequestDto } from '../dtos/requests/register-request.dto';
import { UserDto } from '@apps/modules/users/dtos/user.dto';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { AppMailService } from '@libs/shared/services/app-mail.service';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';
import { TenantService } from '@apps/modules/tenants/services/tenant.service';
import { FacebookPageService } from '@apps/modules/facebook-pages/services/facebook-page.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
	private accessTokenTime: string;
	private refreshTokenTime: string;
	private maxMail: number = 5;

	constructor(
		private readonly _configService: AppConfigService,
		private readonly jwtService: JwtService,
		private readonly _utilService: UtilService,
		private readonly _loggerService: AppLoggerService,
		private readonly _mailService: AppMailService,
		private readonly _authCacheService: AuthCacheService,
		@Inject(UsersService) private readonly _userService: UsersService,
		@Inject(TenantService) private readonly _tenantService: TenantService,
		@Inject(FacebookPageService) private readonly _facebookPageService: FacebookPageService
	) {
		this.accessTokenTime = `${this._configService.get('ACCESS_TOKEN_EXPIRED') || DEFAULT_ACCESS_TOKEN_EXPIRED}h`;
		this.refreshTokenTime = `${this._configService.get('REFRESH_TOKEN_EXPRIRED') || DEFAULT_REFRESH_TOKEN_EXPIRED
			}h`;
		this.accessTokenTime = `${this._configService.getNumber('MAX_MAIL_VERIFY_SENDING') || MAX_MAIL_VERIFY_SENDING}h`;
	}

	async verifyFacebookPage(request: { pageId: string, tenantId: string }): Promise<boolean> {
		const page = await this._facebookPageService.getOneById(Number(request?.pageId));
		return page?.id && page.tenantId === request?.tenantId
	}

	async verifyEmail(email: string, code: string): Promise<boolean> {
		const confirmCache = await this._authCacheService.getConfirmEmail(email, code);
		if (!confirmCache) {
			throw new NotFoundException();
		}

		const result = await this._userService.verifyEmail(email);

		if (!result) {
			throw new BadRequestException();
		}

		await this._authCacheService.deleteAllConfirm(email);
		return result;
	}

	async register(request: RegisterRequestDto): Promise<boolean> {
		const result = await this._userService.create(request);

		const totalConfirm = await this._authCacheService.countTotalConfirm(request?.email);

		if (totalConfirm > this.maxMail) {
			throw new BadRequestException('too_much_mail_sending');
		}

		const code = this._utilService.generateUniqueCode(10);
		await this._authCacheService.setConfirmEmail(request.email, code);

		await this._mailService.send(request.email, 'Đăng ký', 'register', {
			name: request.name,
			link: `${this._configService.frontEndUrl}/verify-email?email=${request?.email}&code=${code}`,
		});
		return !!result;
	}

	async getMe(userId: string): Promise<UserDto> {
		const user = await this._userService.getOne({ id: userId });
		return user;
	}

	async login(request: LoginRequestDto): Promise<LoginResponseDto> {
		const payload = await this._userService.validateLogin({ email: request.email, password: request.password });
		try {
			const user = toPlainObject(payload);
			const accessToken = this.jwtService.sign(user, { expiresIn: this.accessTokenTime });
			const refreshToken = this.jwtService.sign(user, { expiresIn: this.refreshTokenTime });

			await this._authCacheService.setSession(user.id, user);

			// const session = await this._authCacheService.getSession(user?.id)
			return {
				user: user,
				token: {
					accessToken,
					refreshToken,
				},
			};
		} catch (err) {
			this._loggerService.error(AuthService.name, JSON.stringify(err));
			throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR)
		}
	}

	async selectTenant(data: {
		tenantId: string, userId: string
	}): Promise<boolean> {
		const { tenantId, userId } = data;

		const session = await this._authCacheService.getSession(userId);
		if (!session) {
			throw new UnauthorizedException();
		}

		const userTenantList = await this._tenantService.getList({}, userId);
		const usertenant = userTenantList.data.find(_usertenant => _usertenant.tenantId == tenantId);

		if (!usertenant) {
			throw new BadRequestException()
		}

		session.userTenant = usertenant;

		await this._authCacheService.setSession(userId, session);

		return true;
	}

	async validateUser(userId: string): Promise<UserSessionDto> {
		const session = await this._authCacheService.getSession(userId);
		return session;
	}
}
