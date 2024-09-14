import { AppLoggerService, UtilService } from "@libs/shared/services";
import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FacebookConversationService } from "./facebook-conversation.service";
import { FacebookExternalService } from "@apps/externals/facebook-externals/facebook-external.service";
import { FacebookConversationRepository } from "../repositories/facebook-conversation.repository";
import { PaginationResponseDto } from "@libs/shared/dtos/response.dto";
import { FacebookConversationMessageRepository } from "../repositories/facebook-conversation-message.repository";
import { FacebookConversationAudienceRepository } from "../repositories/facebook-conversation-audience.repository";
import { FacebookConversationEntity } from "../entities/facebook-conversation.entity";
import { FacebookConversationAudienceEntity } from "../entities/facebook-conversation-audience.entity";
import { FacebookConversationMessageEntity } from "../entities/facebook-conversation-message.entity";
import { GetFacebookConverstaionListRequestDto } from "../dtos/requests/get-facebook-conversation-list.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { FacebookConversationDto } from "../dtos/facebook-conversation.dto";
import { ResponseDescription } from "@libs/shared/constants/descriptions.constant";
import { GetFacebookMessageListRequestDto } from "../dtos/requests/get-message-list.dto";
import { FacebookConversationMessageDto } from "../dtos/facebook-conversation-message.dto";
import { FindManyOptions, LessThan } from "typeorm";
import { FacebookPageService } from "@apps/modules/facebook-pages/services/facebook-page.service";

@Injectable()
export class FacebookConversationServiceImpl implements FacebookConversationService {
    constructor(
        private readonly _loggerService: AppLoggerService,
        private readonly _utilService: UtilService,
        private readonly _facebook_external_service: FacebookExternalService,
        @InjectMapper() private readonly _mapper: Mapper,
        @Inject(forwardRef(() => FacebookPageService)) private readonly _facebookPageService: FacebookPageService,
        @Inject(FacebookConversationRepository) private readonly _facebookConversationRepository: FacebookConversationRepository,
        @Inject(FacebookConversationMessageRepository) private readonly _facebookConversationMessageRepository: FacebookConversationMessageRepository,
        @Inject(FacebookConversationAudienceRepository) private readonly _facebookConversationAudienceRepository: FacebookConversationAudienceRepository
    ) {
    }

    async sendMessage(data: { pageId: number, message: string, recipientId: number }): Promise<boolean> {
        const facebookPageToken = await this._facebookPageService.getPageToken(data.pageId);

        const result = await this._facebook_external_service.sendResponseMessage({
            sender_id: data.pageId.toString(),
            recipient_id: data.recipientId,
            page_access_token: facebookPageToken,
            message: data.message,
        });

        if (result.error_code === 10) {
            throw new BadRequestException('time_response_invalid');
        }

        return true
    }

    async getMessageList(request: GetFacebookMessageListRequestDto, pageId: number, conversationId: string): Promise<PaginationResponseDto<FacebookConversationMessageDto>> {
        const conversation = await this._facebookConversationRepository.findOne({ where: { id: conversationId } });
        if (!conversation?.id) {
            throw new NotFoundException()
        }

        if (Number(conversation?.facebook_page_id) !== pageId) {
            throw new BadRequestException()
        }

        try {

            const [data, total] = await this._facebookConversationMessageRepository.findAndCount({
                where: {
                    facebook_conversation_id: conversationId, sending_time: request?.lastMessageTime ? LessThan(new Date(request?.lastMessageTime)) : undefined
                }
            }, request);


            return {
                data: this._mapper.mapArray(data, FacebookConversationMessageEntity, FacebookConversationMessageDto),
                total: total,
            };

        } catch (err) {
            this._loggerService.error(FacebookConversationServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
    }

    async getConversationList(request: GetFacebookConverstaionListRequestDto, pageId: number) {
        try {
            const [data, total] = await this._facebookConversationRepository.findAndCount({ where: { facebook_page_id: pageId }, relations: { facebook_conversation_audience: true } }, request);
            return {
                data: this._mapper.mapArray(data, FacebookConversationEntity, FacebookConversationDto),
                total: total,
            };


        } catch (err) {
            this._loggerService.error(FacebookConversationServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
    }

    async syncConversation(facebookPageId: number, facebookPageToken: string, tenant_id: string): Promise<boolean> {
        try {
            const conversationRawList = await this._facebook_external_service.getConversation({
                page_id: facebookPageId.toString(),
                page_access_token: facebookPageToken,
            });

            const conversation_model_list: Partial<FacebookConversationEntity>[] = [];
            const audience_model_list: Partial<FacebookConversationAudienceEntity>[] = [];
            let message_model_list: Partial<FacebookConversationMessageEntity>[] = [];

            conversationRawList?.forEach((_conversation_raw) => {
                const audience = _conversation_raw.participants.data.find(
                    (_participant) => Number(_participant.id) !== facebookPageId
                );

                if (audience) {
                    const audianeModel: Partial<FacebookConversationAudienceEntity> = {
                        id: Number(audience.id),
                        name: audience.name,
                        email: audience.email,
                    };

                    audience_model_list.push(audianeModel);
                }

                const message_list: Partial<FacebookConversationMessageEntity>[] = _conversation_raw.messages.data.map((_message_raw) => {
                    const message: Partial<FacebookConversationMessageEntity> = {
                        id: _message_raw.id,
                        message: _message_raw.message,
                        is_echo: Number(_message_raw.from.id) === Number(facebookPageId),
                        sending_time: new Date(_message_raw.created_time),
                        facebook_conversation_id: _conversation_raw.id,

                    };
                    if (_message_raw.attachments?.data?.length) {
                        message.attachments = _message_raw.attachments?.data
                    }
                    return message
                });

                message_model_list = [...message_model_list, ...message_list];

                const conversation: Partial<FacebookConversationEntity> = {
                    id: _conversation_raw.id,
                    facebook_page_id: Number(facebookPageId),
                    last_message: message_list[0].message,
                    last_message_time: message_list[0].sending_time,
                    last_message_attachment: message_list[0].attachments?.length > 0,
                    is_echo: message_list[0].is_echo,
                    facebook_conversation_audience_id: Number(audience.id)
                };

                conversation_model_list.push(conversation);
            });

            await this._facebookConversationAudienceRepository.upsert(audience_model_list,
                { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true, upsertType: 'on-conflict-do-update' }
            )

            await this._facebookConversationRepository.upsert(conversation_model_list,
                { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true, upsertType: 'on-conflict-do-update' }
            )

            await this._facebookConversationMessageRepository.upsert(message_model_list,
                { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true, upsertType: 'on-conflict-do-update' }
            )

            return true;
        } catch (err) {
            this._loggerService.error(FacebookConversationServiceImpl.name, JSON.stringify(err));
            return false;
        }
    }

}