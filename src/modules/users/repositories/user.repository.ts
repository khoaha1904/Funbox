import { BaseRepository } from '@libs/shared/databases/base-repository';
import { UserEntity } from '../entities/user.entity';

export const UsersRepository = Symbol.for('UsersRepository');
export type UsersRepository = BaseRepository<UserEntity>;
