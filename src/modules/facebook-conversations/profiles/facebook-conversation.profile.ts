import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { FacebookConversationEntity } from '../entities/facebook-conversation.entity';
import { FacebookConversationDto } from '../dtos/facebook-conversation.dto';
import { FacebookConversationMessageAttachment, FacebookConversationMessageEntity } from '../entities/facebook-conversation-message.entity';
import { FacebookConversationMessageAttachmentDto, FacebookConversationMessageDto } from '../dtos/facebook-conversation-message.dto';
import { FacebookConversationAudienceEntity } from '../entities/facebook-conversation-audience.entity';
import { FacebookConversationAudienceDto } from '../dtos/facebook-conversation-audience.dto';

@Injectable()
export class FacebookConversationProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // ? App
            createMap(mapper, FacebookConversationEntity, FacebookConversationDto);
            createMap(mapper, FacebookConversationMessageEntity, FacebookConversationMessageDto);
            createMap(mapper, FacebookConversationAudienceEntity, FacebookConversationAudienceDto,
                forMember(dest => dest.id, mapFrom(src => Number(src.id)))
            );
            createMap(mapper, FacebookConversationMessageAttachment, FacebookConversationMessageAttachmentDto, forMember(
                (destination) => destination.image_data,
                mapFrom((source) => source.image_data)
            ));
        };
    }
}
