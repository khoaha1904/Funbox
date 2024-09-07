import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserSessionDto } from '../dtos/user-session.dto';
import { BaseController } from '@libs/shared/common/controllers';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RegisterRequestDto } from '../dtos/requests/register-request.dto';

@Controller('auth')
export class AuthController extends BaseController {
	constructor(private readonly _authService: AuthService) {
		super();
	}

	@Get('me')
	@HttpCode(200)
	@UseGuards(JWTAuthGuard)
	async getProfile(@CurrentUser() user: UserSessionDto) {
		return {
			data: user,
			message: ResponseDescription.OK,
		};
	}

	@Post('login')
	@HttpCode(200)
	async login(@Body() request: LoginRequestDto) {
		return {
			data: await this._authService.login(request),
			message: ResponseDescription.OK,
		};
	}

	@Post('select-tenant')
	@HttpCode(200)
	async selectTenant(@Body() request: LoginRequestDto) {
		return {
			data: await this._authService.login(request),
			message: ResponseDescription.OK,
		};
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() request: RegisterRequestDto) {
		return {
			data: await this._authService.register(request),
			message: ResponseDescription.CREATED,
		};
	}

	// @Post('verify-email')
	// @HttpCode(HttpStatus.OK)
	// async verifyEmail(@Body() request: VerifyEmailRequestDto) {
	// 	return {
	// 		data: await this._authService.verifyEmail(request.email, request.code),
	// 		message: ResponseDescription.OK,
	// 	};
	// }

	// @Post('upload')
	// @UseInterceptors(
	// 	FileInterceptor('file', {
	// 		storage: diskStorage({
	// 			destination: './uploads',
	// 			filename: (req, file, cb) => {
	// 				const randomName = Array(32)
	// 					.fill(null)
	// 					.map(() => Math.round(Math.random() * 16).toString(16))
	// 					.join('');
	// 				return cb(null, `${randomName}${extname(file.originalname)}`);
	// 			},
	// 		}),
	// 	})
	// )
	// async uploadFile(@UploadedFile() file: Express.Multer.File) {
	// 	if (!file) {
	// 		throw new BadRequestException();
	// 	}
	// 	console.log(file);
	// 	this._authService.test(file);
	// 	// unlink(file.path, (err) => {});
	// 	return { filePath: file.path };
	// }
}
