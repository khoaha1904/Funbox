import { Inject, Injectable } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { AppLoggerService } from '@libs/shared/services';
import { ReceiveWebhookResponse } from '../dtos/responses/recieve-webhook.dto';
import { FacebookConversationService } from '@apps/modules/facebook-conversations/services/facebook-conversation.service';

@Injectable()
export class WebhookServiceImpl implements WebhookService {
    constructor(
        private readonly loggerService: AppLoggerService,
        @Inject(FacebookConversationService) private readonly _facebookConversationService: FacebookConversationService
        // @Inject(FacebookMessageService) private readonly _facebookService: FacebookMessageService,
    ) { }

    async syncMessage(request: ReceiveWebhookResponse): Promise<void> {
        const isEcho = request?.entry[0].messaging[0].message?.is_echo;
        const pageId = isEcho ? request?.entry[0].messaging[0].sender.id : request?.entry[0].messaging[0].recipient.id;
        await this._facebookConversationService.syncOneMessage(
            request?.entry[0].messaging[0].message.mid,
            pageId,
            isEcho
        )
    }
}
