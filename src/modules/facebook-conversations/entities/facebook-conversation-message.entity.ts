import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FacebookConversationEntity } from './facebook-conversation.entity';
import { BaseNoneIdEntity } from '@libs/shared/entities/base-none-id.entity';

export class FacebookConversationMessageAttachment {
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

@Entity('facebook_conversation_messages')
export class FacebookConversationMessageEntity extends BaseNoneIdEntity {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    @AutoMap()
    id: string;

    @Column({ type: 'text', nullable: true })
    @AutoMap()
    message?: string;

    @Column({ type: 'boolean', nullable: true, default: true })
    @AutoMap()
    is_echo: boolean;

    @Column({ type: 'timestamp with time zone', nullable: true })
    @AutoMap()
    sending_time: Date;

    @Column({ type: 'varchar', nullable: true })
    @AutoMap()
    facebook_conversation_id: string;

    @ManyToOne(() => FacebookConversationEntity, (conversation) => conversation.facebook_conversation_messages)
    @AutoMap(() => FacebookConversationEntity)
    facebook_conversation: FacebookConversationEntity;

    @Column({ type: 'jsonb', nullable: true })
    @AutoMap(() => [FacebookConversationMessageAttachment])
    attachments: FacebookConversationMessageAttachment[]
}
