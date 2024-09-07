import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserRequestDto {
	@IsString()
	@IsOptional()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;
}
