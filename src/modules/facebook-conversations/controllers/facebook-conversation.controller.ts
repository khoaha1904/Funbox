import { Body, Controller, ForbiddenException, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FacebookConversationService } from '../services/facebook-conversation.service';
import { BaseController } from '@libs/shared/common/controllers';
import { JWTAuthGuard } from '@apps/modules/auth/guards/jwt-auth.guard';
import { FacebookPageGuard } from '@apps/modules/auth/guards/facebook-page.guard';
import { GetFacebookConverstaionListRequestDto } from '../dtos/requests/get-facebook-conversation-list.dto';
import { GetFacebookMessageListRequestDto } from '../dtos/requests/get-message-list.dto';
import { SendFacebookMessageRequestDto } from '../dtos/requests/send-facebook-message.dto';

@Controller(':page_id/facebook-conversations')
export class FacebookConversationController extends BaseController {
    constructor(
        @Inject(FacebookConversationService) private readonly _service: FacebookConversationService
    ) {
        super();
    }

    @Post('send-message')
    @UseGuards(JWTAuthGuard, FacebookPageGuard)
    async sendMessage(@Body() request: SendFacebookMessageRequestDto, @Param('page_id') page_id: string) {
        return {
            data: await this._service.sendMessage({
                pageId: Number(page_id),
                message: request?.message,
                recipientId: request?.recipientId
            }),
        };
    }


    @Get(':conversation_id/messages')
    @UseGuards(JWTAuthGuard, FacebookPageGuard)
    async getMessageList(@Query() request: GetFacebookMessageListRequestDto, @Param('page_id') page_id: string, @Param('conversation_id') conversation_id: string) {
        return {
            data: await this._service.getMessageList(request, Number(page_id), conversation_id),
        };
    }

    @Get('')
    @UseGuards(JWTAuthGuard, FacebookPageGuard)
    async getList(@Query() request: GetFacebookConverstaionListRequestDto, @Param('page_id') page_id: string) {
        return {
            data: await this._service.getConversationList(request, Number(page_id)),
        };
    }
}
