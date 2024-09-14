import { UserDto } from '@apps/modules/users/dtos/user.dto';
import { UserSessionDto } from '../dtos/user-session.dto';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RegisterRequestDto } from '../dtos/requests/register-request.dto';

export class AuthService {
	verifyEmail: (email: string, code: string) => Promise<boolean>;
	getMe: (userId: string) => Promise<UserDto>;
	login: (request: LoginRequestDto) => Promise<any>;
	validateUser: (userId: string) => Promise<UserSessionDto>;
	selectTenant: (data: { tenantId: string, userId: string }) => Promise<boolean>;
	// verifyRole?: (userId: string, tenantId: string) => Promise<boolean>;
	verifyFacebookPage: (request: { pageId: string, tenantId: string }) => Promise<boolean>;
	register: (request: RegisterRequestDto) => Promise<boolean>;
}
