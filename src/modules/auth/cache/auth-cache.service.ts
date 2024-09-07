import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@libs/shared/services';
import { UserSessionDto } from '../dtos/user-session.dto';
import { DEFAULT_ACCESS_TOKEN_EXPIRED, MAIL_VERIFY_TTL } from '../constants/auth.constants';
import { AppCacheService } from 'src/caches/cache.service';

@Injectable()
export class AuthCacheService {
	private auth_prefix = 'session';
	private confirm_prfix = 'email_confirm';
	private confirm_email_expired: number;
	private time: number;

	constructor(
		private readonly _cacheService: AppCacheService,
		private readonly _configService: AppConfigService
	) {
		this.confirm_email_expired = this._configService.getNumber('MAIL_VERIFY_TTL') || MAIL_VERIFY_TTL;
		this.time = Number(this._configService.get('ACCESS_TOKEN_EXPIRED') || DEFAULT_ACCESS_TOKEN_EXPIRED) * 60 * 60;
	}

	private getCacheKey(key: string) {
		return `${this.auth_prefix}-${key}`;
	}

	async countTotalConfirm(email: string): Promise<number> {
		try {
			const key = `${this.confirm_prfix}-${email}`;
			return await this._cacheService.countByPrefix(key);
		} catch (err) {
			return 0;
		}
	}

	async deleteAllConfirm(email: string): Promise<void> {
		try {
			const key = `${this.confirm_prfix}-${email}`;
			await this._cacheService.deleteByPrefix(key);
		} catch (err) { }
	}

	async setConfirmEmail(email: string, code: string): Promise<void> {
		try {
			const key = `${this.confirm_prfix}-${email}-${code}`;
			await this._cacheService.setOne(key, { email, code }, this.confirm_email_expired);
		} catch (err) {
			return null;
		}
	}

	async getConfirmEmail(email: string, code: string): Promise<{ email: string; code: string }> {
		try {
			const key = `${this.confirm_prfix}-${email}-${code}`;
			return (await this._cacheService.getOne(key)) || null;
		} catch (err) {
			return null;
		}
	}

	async getSession(user_id: string): Promise<UserSessionDto> {
		try {
			const key = this.getCacheKey(user_id);
			return await this._cacheService.getOne(key);
		} catch (err) {
			return null;
		}
	}

	async setSession(user_id: string, user_session: any): Promise<void> {
		try {
			const key = this.getCacheKey(user_id);
			await this._cacheService.setOne(key, user_session);
		} catch (err) {
			return;
		}
	}

	async removeSession(userId: string): Promise<void> {
		try {
			const key = this.getCacheKey(userId);
			await this._cacheService.deleteOne(key);
		} catch (err) {
			return;
		}
	}
}
