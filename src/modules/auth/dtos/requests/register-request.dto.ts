import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class RegisterRequestDto {
	@IsString()
	@IsNotEmpty({
		message: 'Email is required',
	})
	@AutoMap()
	email: string;

	@IsString()
	@IsOptional()
	@AutoMap()
	name: string;

	@IsString()
	@IsNotEmpty({
		message: 'Password is required',
	})
	password: string;
}
