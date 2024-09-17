import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@libs/shared/services';
import { WebhookService } from './services/webhook.service';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookServiceImpl } from './services/webhook.service.impl';
import { FacebookConversationModule } from '../facebook-conversations/facebook-conversastion.module';

const services = [{ provide: WebhookService, useClass: WebhookServiceImpl }];
const providers = [];

@Module({
    imports: [
        SharedModule,
        FacebookConversationModule,
        // FacebookMessageModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    controllers: [WebhookController],
    providers: [...providers, ...services],
    exports: [...services],
})
export class WebhookModule { }
