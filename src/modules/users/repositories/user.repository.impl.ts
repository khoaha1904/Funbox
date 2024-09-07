import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersRepositoryImpl extends BaseRepositoryImpl<UserEntity> implements UsersRepository {
	constructor(
		@InjectRepository(UserEntity)
		repository: Repository<UserEntity>
	) {
		super(repository);
	}
}
