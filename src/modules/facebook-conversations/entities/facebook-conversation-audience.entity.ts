import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FacebookConversationEntity } from './facebook-conversation.entity';
import { BaseNoneIdEntity } from '@libs/shared/entities/base-none-id.entity';

@Entity('facebook_conversation_audiences')
export class FacebookConversationAudienceEntity extends BaseNoneIdEntity {
    @PrimaryColumn({ type: 'int8' })
    @AutoMap()
    id: number;

    @ManyToOne(() => FacebookConversationEntity, (conversation) => conversation.facebook_conversation_audience)
    @AutoMap(() => [FacebookConversationEntity])
    facebook_conversations: FacebookConversationEntity[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    email: string;
}
