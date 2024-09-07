import { BaseRepository } from '@libs/shared/databases/base-repository';
import { TenantEntity } from '../entities/tenant.entity';

export const TenantRepository = Symbol.for('TenantRepository');
export type TenantRepository = BaseRepository<TenantEntity>;
