import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from '../entities/tenant.entity';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantRepositoryImpl extends BaseRepositoryImpl<TenantEntity> implements TenantRepository {
    constructor(
        @InjectRepository(TenantEntity)
        repository: Repository<TenantEntity>
    ) {
        super(repository);
    }
}
