import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@libs/shared/databases/base-repository.impl';
import { FacebookConversationAudienceEntity } from '../entities/facebook-conversation-audience.entity';
import { FacebookConversationAudienceRepository } from './facebook-conversation-audience.repository';

@Injectable()
export class FacebookConversationAudienceRepositoryImpl extends BaseRepositoryImpl<FacebookConversationAudienceEntity> implements FacebookConversationAudienceRepository {
    constructor(
        @InjectRepository(FacebookConversationAudienceEntity)
        repository: Repository<FacebookConversationAudienceEntity>
    ) {
        super(repository);
    }
}
