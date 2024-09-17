import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { FacebookConversationMessageEntity } from '../entities/facebook-conversation-message.entity';
import { ClientKafka } from '@nestjs/microservices';
import { FacebookConversationService } from '../services/facebook-conversation.service';

@Injectable()
export class FacebookMessageSubscriber implements EntitySubscriberInterface<FacebookConversationMessageEntity> {
    constructor(
        @Inject(FacebookConversationService) private readonly _facebookConversationService: FacebookConversationService,
        private readonly connection: Connection
    ) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return FacebookConversationMessageEntity;
    }

    async afterInsert(event: InsertEvent<FacebookConversationMessageEntity>) {
        console.log('Entity inserted:', event.entity);

        await this._facebookConversationService.handleNewMessage(event.entity)
    }
}
