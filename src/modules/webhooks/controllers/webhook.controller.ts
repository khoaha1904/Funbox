import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    Inject,
    Param,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from '../services/webhook.service';
import { ConfirmFacebookWebhookResponse } from '../dtos/responses/confirm-webhook.dto';


@Controller('webhooks')
export class WebhookController {
    constructor(@Inject(WebhookService) private readonly _webhookService: WebhookService) {
    }

    @Post('facebook')
    async receiveWebhook(@Body() request: any, @Res() res: Response) {
        try {
            await this._webhookService.syncMessage(request);
            res.status(200).send();
        } catch (err) {
            console.log(err);
        }
    }

    @Get('facebook')
    async getShops(@Query() query: any, @Res() res: Response) {
        const newQuery: ConfirmFacebookWebhookResponse = query;
        if (newQuery['hub.verify_token'] !== 'UMvwe3T9QWxQQGSSMzFmEEwBUR9') {
            throw new ForbiddenException();
        }

        res.status(200).send(newQuery['hub.challenge']);
    }
}
