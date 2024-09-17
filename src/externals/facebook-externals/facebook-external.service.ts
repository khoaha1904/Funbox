import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as _ from 'lodash';

import { AppConfigService, AppLoggerService } from '@libs/shared/services';
import { firstValueFrom } from 'rxjs';
import { FacebookExternalsConversationDto, FacebookExternalsMessage } from './dtos/facebook-external-conversation.dto';
import { SentFacebookExternalsMessage } from './dtos/requests/send-facebook-external-message.dto';
import { FacebookPagingExternalsResponse } from './dtos/responses/common';
import { GetFacebookExternalsConversations } from './dtos/requests/get-facebook-external-conversation.dto';
import { FacebookExternalsPage } from './dtos/facebook-external-page.dto';

@Injectable()
export class FacebookExternalService {
    base_url: string;
    version: string;

    constructor(
        private readonly _configService: AppConfigService,
        private readonly httpService: HttpService,
        private readonly loggerService: AppLoggerService
    ) {
        this.base_url = this._configService.get('FACEBOOK_API_BASE_URL');
        this.version = this._configService.get('FACEBOOK_API_VERSION');

        // this.sendResponseAttachment({
        // 	sender_id: '108917855305504',
        // 	recipient_id: 8138530126188864,
        // 	page_access_token:
        // 		'EAAFZB0WLHaE8BO7z7ocBCdmZBv4DcGno8vkGgUNWLMjeJwq4TiZBFonzda7QdbLio094Cok34FZBCclEkwaZCEO77GdGNfzISMGZBR8bAVSqfSsk88b30Ah253YOb3b9aTVoEdqOAblMEMscAnnyAZBcVS5UZCPfghPe7XY11rWfVAjsg0LEZC2mLxiDJssBkxeritN7w8qxZALaAiOcg5iQroKIH0wtMJVCtn6X5WFW38',
        // 	file_path: 'uploads/4a7a8029357964302a4433b15af23095.jpg',
        // 	file_type: 'image/jpg',
        // });
    }

    async getMessage(message_id: string, page_access_token: string): Promise<FacebookExternalsMessage> {
        const url = `${this.base_url}/${this.version}/${message_id}?fields=id,message,from,to,created_time,attachments,reactions&access_token=${page_access_token}`;


        try {
            const result = await firstValueFrom(this.httpService.get(url));

            return result?.data as FacebookExternalsMessage;
        } catch (err) {
            this.loggerService.error(FacebookExternalService.name, JSON.stringify(err.response?.data));
            return null;
        }
    }

    // async sendResponseAttachment(payload: SentFacebookExternalsMessageAttachment) {
    //     // const url = `${this.base_url}/${this.version}/${payload.sender_id}/message_attachment`;
    //     const url = 'https://graph.facebook.com/v19.0/108917855305504/message_attachment';
    //     // curl -X POST "https://graph.facebook.com/v19.0/Your-page-id/message_attachment" \
    //     //      -H "Content-Type: application/json" \
    //     //      -d '{
    //     //            "access_token":"Your_page_access_token",
    //     //            "message":{
    //     //              "attachment":{
    //     //                "type":"image",
    //     //                "payload":{
    //     //                  "url":"https.your-url.com/image.jp",
    //     //                  "is_reusable": true
    //     //                }
    //     //              }
    //     //            }
    //     //          }'

    //     const image_link = join(this._configService.get('BACK_END_URL'), payload.file_path);
    //     const request = {
    //         access_token: payload.page_access_token,
    //         // message: {
    //         // 	attachment: {
    //         // 		type: 'image',
    //         // 		payload: {
    //         // 			url: image_link,
    //         // 			is_reusable: true,
    //         // 		},
    //         // 	},
    //         // },
    //     };

    //     try {
    //         const result = await firstValueFrom(this.httpService.post(url, undefined, { params: request }));

    //         if (result.data.error) {
    //             this.loggerService.error(FacebookExternalService.name, JSON.stringify(result.data));
    //             return { error_code: result.data.error?.code };
    //         }

    //         return {
    //             message_id: result.data.message_id,
    //         };
    //         return;
    //     } catch (err) {
    //         console.log(err.response?.data?.error);
    //         this.loggerService.error(FacebookExternalService.name, JSON.stringify(err.response?.data));
    //         return { error_code: err.response?.data?.error?.code };
    //     }
    // }

    async sendResponseMessage(
        payload: SentFacebookExternalsMessage
    ): Promise<{ message_id?: string; error_code?: number }> {
        const url = `${this.base_url}/${this.version}/${payload.sender_id}/messages`;

        try {
            const result = await firstValueFrom(
                this.httpService.post<
                    {
                        recipient_id?: string;
                        message_id?: string;
                    } & FacebookPagingExternalsResponse
                >(url, undefined, {
                    params: {
                        messaging_type: 'RESPONSE',
                        recipient: { id: payload.recipient_id },
                        access_token: payload.page_access_token,
                        message: { text: payload.message },
                    },
                })
            );

            if (result.data.error) {
                this.loggerService.error(FacebookExternalService.name, JSON.stringify(result.data));
                return { error_code: result.data.error?.code };
            }

            return {
                message_id: result.data.message_id,
            };
        } catch (err) {
            console.log(err.response?.data?.error);
            this.loggerService.error(FacebookExternalService.name, JSON.stringify(err.response?.data));
            return { error_code: err.response?.data?.error?.code };
        }
    }

    async getConversation(payload: GetFacebookExternalsConversations): Promise<FacebookExternalsConversationDto[]> {
        const url = `${this.base_url}/${this.version}/${payload.page_id}/conversations`;

        try {
            const result = await firstValueFrom(
                this.httpService.get<FacebookPagingExternalsResponse<FacebookExternalsConversationDto>>(url, {
                    params: {
                        user_id: payload?.user_id,
                        access_token: payload.page_access_token,
                        fields: 'participants,messages{id,message,from,to,created_time,attachments,reactions}',
                    },
                })
            );

            if (result.data.error) {
                this.loggerService.error(FacebookExternalService.name, JSON.stringify(result.data));
                return null;
            }
            return result.data.data;
        } catch (err) {
            this.loggerService.error(FacebookExternalService.name, JSON.stringify(err.response?.data));
            return null;
        }
    }

    async getFacebookPageList(user_access_token: string): Promise<FacebookExternalsPage[]> {
        const url = `${this.base_url}/me/accounts`;

        try {
            const result = await firstValueFrom(
                this.httpService.get<FacebookPagingExternalsResponse<FacebookExternalsPage>>(url, {
                    params: {
                        access_token: user_access_token,
                    },
                })
            );

            if (result.data.error) {
                this.loggerService.error(FacebookExternalService.name, JSON.stringify(result.data));
                return null;
            }
            return result.data.data;
        } catch (err) {
            this.loggerService.error(FacebookExternalService.name, JSON.stringify(err.response?.data));
            return null;
        }
    }
}
