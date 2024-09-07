import { PaginationResponseDto } from '@libs/shared/dtos/response.dto';
import { UserDto } from '../dtos/user.dto';
import { CreateUserRequestDto } from '../dtos/requests/create-user.request';
import { GetUserListRequestDto } from '../dtos/requests/get-list-user.request';
import { GetOneUserRequestDto } from '../dtos/requests/get-one-user.request';
import { ValidateUserRequestDto } from '../dtos/requests/validate-user.request';

export const UsersService = Symbol.for('UsersService');
export type UsersService = {
	validateLogin(request: ValidateUserRequestDto): Promise<UserDto>;
	verifyEmail(email: string): Promise<boolean>;
	getOne(request: GetOneUserRequestDto): Promise<UserDto>;
	create(request: CreateUserRequestDto): Promise<UserDto>;
	getList(request: GetUserListRequestDto): Promise<PaginationResponseDto<UserDto>>;
};
