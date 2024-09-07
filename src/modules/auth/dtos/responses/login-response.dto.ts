export class LoginResponseDto<T = any> {
	user: T;
	token: {
		accessToken: string;
		refreshToken: string;
	};
}
