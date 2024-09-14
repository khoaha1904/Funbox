import { AutoMap } from '@automapper/classes';
import { BaseNoneIdEntity } from '@libs/shared/entities/base-none-id.entity';
import { FacebookConversationDto } from './facebook-conversation.dto';

export class FacebookConversationMessageAttachmentDto {
    @AutoMap()
    name: string;

    @AutoMap()
    mime_type: string;

    @AutoMap()
    file_url?: string;

    @AutoMap()
    size: number;

    @AutoMap()
    image_data?: {
        url: string;
        width: number;
        height: number;
        max_width: number;
        image_type: number;
        max_height: number;
        preview_url: string;
        render_as_sticker: boolean;
    };
}

export class FacebookConversationMessageDto extends BaseNoneIdEntity {
    @AutoMap()
    id: string;

    @AutoMap()
    message?: string;

    @AutoMap()
    is_echo: boolean;

    @AutoMap()
    sending_time: Date;

    @AutoMap()
    facebook_conversation_id: string;

    @AutoMap(() => FacebookConversationDto)
    facebook_conversaion: FacebookConversationDto;

    @AutoMap(() => [FacebookConversationMessageAttachmentDto])
    attachments: FacebookConversationMessageAttachmentDto[]
}
