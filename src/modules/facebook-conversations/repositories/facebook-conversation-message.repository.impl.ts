import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { FacebookConversationMessageRepository } from './facebook-conversation-message.repository';
import { FacebookConversationMessageEntity } from '../entities/facebook-conversation-message.entity';

@Injectable()
export class FacebookConversationMessageRepositoryImpl extends BaseRepositoryImpl<FacebookConversationMessageEntity> implements FacebookConversationMessageRepository {
    constructor(
        @InjectRepository(FacebookConversationMessageEntity)
        repository: Repository<FacebookConversationMessageEntity>
    ) {
        super(repository);
    }
}
