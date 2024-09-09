import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { UserTenantEntity } from '../entities/user-tenant.entity';
import { UserTenantRepository } from './user-tenant.repository';

@Injectable()
export class UserTenantRepositoryImpl extends BaseRepositoryImpl<UserTenantEntity> implements UserTenantRepository {
    constructor(
        @InjectRepository(UserTenantEntity)
        repository: Repository<UserTenantEntity>
    ) {
        super(repository);
    }
}
