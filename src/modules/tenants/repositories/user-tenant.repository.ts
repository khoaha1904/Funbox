import { BaseRepository } from '@libs/shared/databases/base-repository';
import { UserTenantEntity } from '../entities/user-tenant.entity';

export const UserTenantRepository = Symbol.for('UserTenantRepository');
export type UserTenantRepository = BaseRepository<UserTenantEntity>;
