import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { AppConfigService, AppLoggerService } from '@libs/shared/services';
import { UserDto } from '../dtos/user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserEntity } from '../entities/user.entity';
import { CreateUserRequestDto } from '../dtos/requests/create-user.request';
import * as bcrypt from 'bcrypt';
import { GetOneUserRequestDto } from '../dtos/requests/get-one-user.request';
import { UsersService } from './user.service';
import { UsersRepository } from '../repositories/user.repository';
import { ValidateUserRequestDto } from '../dtos/requests/validate-user.request';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';
import { PaginationResponseDto } from '@libs/shared/dtos/response.dto';
import { GetUserListRequestDto } from '../dtos/requests/get-list-user.request';

@Injectable()
export class UsersServiceImpl implements UsersService {
	constructor(
		@Inject(UsersRepository) private readonly _userRepository: UsersRepository,
		@InjectMapper() private _mapper: Mapper,
		private readonly _loggerService: AppLoggerService
		// private readonly _mailService: AppMailService,
		// private readonly _configService: AppConfigService
	) {
		// this.create({
		// 	name: 'khoa ha',
		// 	email: 'khoaha1904@gmail.com',
		// 	password: 'knight2075'
		// })
	}

	async validateLogin(request: ValidateUserRequestDto): Promise<UserDto> {
		const user = await this._userRepository.findOne({
			where: { email: request.email },
		});
		if (!user) {
			throw new BadRequestException('incorrect_email_or_password');
		}


		if (!user.isActive) {
			throw new BadRequestException('account_is_blocked');
		}

		const isMatch = await bcrypt.compare(request.password, user?.password);
		if (!isMatch) {
			throw new BadRequestException('incorrect_email_or_password');
		}
		return this._mapper.map(user, UserEntity, UserDto);
	}

	async getOne(request: GetOneUserRequestDto): Promise<UserDto> {
		const result = await this._userRepository.findOne({ where: request });
		return this._mapper.map(result, UserEntity, UserDto);
	}

	async verifyEmail(email: string): Promise<boolean> {
		const exist = await this._userRepository.findOne({ where: { email: email } });

		if (exist.verify) {
			throw new BadRequestException();
		}

		try {
			const result = await this._userRepository.findOneAndUpdate({ where: { id: exist.id } }, { verify: true });
			return !!result;
		} catch (err) {
			this._loggerService.error(UsersServiceImpl.name, JSON.stringify(err));
			throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
		}
	}

	async create(request: CreateUserRequestDto): Promise<UserDto> {
		const exist = await this._userRepository.findOne({ where: { email: request?.email } });
		if (exist?.verify) {
			throw new ConflictException();
		}

		const payload: Partial<UserEntity> = {
			email: request?.email,
			name: request?.name,
			verify: false,
			password: await bcrypt.hash(request.password, 10),
		};
		const entity = this._userRepository.create(payload);

		try {
			if (exist) {
				// * Account exist but not verify yet. just update the lated data
				const result = await this._userRepository.findOneAndUpdate({ where: { id: exist.id } }, entity);
				return this._mapper.map(result, UserEntity, UserDto);
			}
			// * Create new
			const result = await this._userRepository.save(entity);
			return this._mapper.map(result, UserEntity, UserDto);
		} catch (err) {
			this._loggerService.error(UsersServiceImpl.name, JSON.stringify(err));
			throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
		}
	}

	async getList(request: GetUserListRequestDto): Promise<PaginationResponseDto<UserDto>> {
		const [data, total] = await this._userRepository.findAndCount({ where: {} }, request);

		return {
			data: this._mapper.mapArray(data, UserEntity, UserDto),
			total: total,
		};
	}
}
