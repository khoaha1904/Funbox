import { IsString } from 'class-validator';

export class GetOneUserRequestDto {
	id: string;

	@IsString()
	email?: string;
}
