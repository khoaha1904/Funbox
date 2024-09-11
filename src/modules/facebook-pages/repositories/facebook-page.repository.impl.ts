import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { FacebookPageEntity } from '../entities/facebook-page.entity';
import { FacebookPageRepository } from './facebook-page.repository';

@Injectable()
export class FacebookPageRepositoryImpl extends BaseRepositoryImpl<FacebookPageEntity> implements FacebookPageRepository {
    constructor(
        @InjectRepository(FacebookPageEntity)
        repository: Repository<FacebookPageEntity>
    ) {
        super(repository);
    }
}
