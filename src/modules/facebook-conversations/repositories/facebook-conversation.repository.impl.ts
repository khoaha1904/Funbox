import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { FacebookConversationEntity } from '../entities/facebook-conversation.entity';
import { FacebookConversationRepository } from './facebook-conversation.repository';

@Injectable()
export class FacebookConversationRepositoryImpl extends BaseRepositoryImpl<FacebookConversationEntity> implements FacebookConversationRepository {
    constructor(
        @InjectRepository(FacebookConversationEntity)
        repository: Repository<FacebookConversationEntity>
    ) {
        super(repository);
    }
}
