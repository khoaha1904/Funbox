import { AutoMap } from '@automapper/classes';
import { BaseNoneIdDto } from '@libs/shared/dtos/common.dto';
import { FacebookPageDto } from '@apps/modules/facebook-pages/dtos/facebook-page.dto';
import { FacebookConversationMessageDto } from './facebook-conversation-message.dto';
import { FacebookConversationAudienceDto } from './facebook-conversation-audience.dto';

export class FacebookConversationDto extends BaseNoneIdDto {
    @AutoMap()
    id?: string;

    @AutoMap()
    facebook_page_id: number;

    @AutoMap()
    facebook_conversation_audience_id: number;

    @AutoMap(() => FacebookPageDto)
    facebook_page?: FacebookPageDto;

    @AutoMap(() => [FacebookConversationMessageDto])
    facebook_conversation_messages?: FacebookConversationMessageDto[];

    @AutoMap(() => FacebookConversationAudienceDto)
    facebook_conversation_audience?: FacebookConversationAudienceDto;

    @AutoMap()
    last_message?: string;

    @AutoMap()
    last_message_time?: Date;

    @AutoMap()
    last_message_attachment?: boolean;

    @AutoMap()
    is_echo?: boolean;
}
