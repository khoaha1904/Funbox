import { AutoMap } from '@automapper/classes';
import { BaseNoneIdDto } from '@libs/shared/dtos/common.dto';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FacebookConversationDto } from './facebook-conversation.dto';

export class FacebookConversationAudienceDto extends BaseNoneIdDto {
    @AutoMap()
    id: number;

    @AutoMap(() => [FacebookConversationDto])
    facebook_conversaions: FacebookConversationDto[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    email: string;
}
