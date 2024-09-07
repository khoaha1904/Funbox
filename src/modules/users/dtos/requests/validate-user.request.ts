import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ValidateUserRequestDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsBoolean()
	@IsOptional()
	remember?: boolean;
}
