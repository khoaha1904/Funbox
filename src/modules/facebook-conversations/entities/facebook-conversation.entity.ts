import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { FacebookConversationMessageEntity } from './facebook-conversation-message.entity';
import { FacebookConversationAudienceEntity } from './facebook-conversation-audience.entity';
import { BaseNoneIdEntity } from '@libs/shared/entities/base-none-id.entity';
import { FacebookPageEntity } from '@apps/modules/facebook-pages/entities/facebook-page.entity';

@Entity('facebook_conversations')
export class FacebookConversationEntity extends BaseNoneIdEntity {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    @AutoMap()
    id?: string;

    @Column({ type: 'int8' })
    @AutoMap()
    facebook_page_id: number;

    @Column({ type: 'int8' })
    @AutoMap()
    facebook_conversation_audience_id: number;

    @ManyToOne(() => FacebookPageEntity, (page) => page.conversations)
    @AutoMap(() => FacebookPageEntity)
    facebook_page?: FacebookPageEntity;

    @OneToMany(() => FacebookConversationMessageEntity, (message) => message.facebook_conversation)
    @AutoMap(() => [FacebookConversationMessageEntity])
    facebook_conversation_messages: FacebookConversationMessageEntity[];

    @ManyToOne(() => FacebookConversationAudienceEntity, (message) => message.facebook_conversations)
    @AutoMap(() => FacebookConversationAudienceEntity)
    facebook_conversation_audience: FacebookConversationAudienceEntity;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    last_message?: string;

    @Column({ type: 'timestamp with time zone', nullable: true })
    @AutoMap()
    last_message_time?: Date;

    @Column({ type: 'boolean', nullable: true })
    @AutoMap()
    last_message_attachment?: boolean;

    @Column({ type: 'boolean', nullable: true })
    @AutoMap()
    is_echo?: boolean;
}
