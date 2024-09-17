import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppConfigService, SharedModule } from '@libs/shared/services';
import { TenantModule } from '../tenants/tenant.module';
import { FacebookExternalModule } from '@apps/externals/facebook-externals/facebook.external.module';
import { DatabaseModule } from '@apps/databases/database.module';
import { FacebookConversationService } from './services/facebook-conversation.service';
import { FacebookConversationRepository } from './repositories/facebook-conversation.repository';
import { FacebookConversationServiceImpl } from './services/facebook-conversation.service.impl';
import { FacebookConversationRepositoryImpl } from './repositories/facebook-conversation.repository.impl';
import { FacebookConversationEntity } from './entities/facebook-conversation.entity';
import { FacebookConversationMessageEntity } from './entities/facebook-conversation-message.entity';
import { FacebookConversationAudienceEntity } from './entities/facebook-conversation-audience.entity';
import { FacebookConversationMessageRepository } from './repositories/facebook-conversation-message.repository';
import { FacebookConversationAudienceRepository } from './repositories/facebook-conversation-audience.repository';
import { FacebookConversationMessageRepositoryImpl } from './repositories/facebook-conversation-message.repository.impl';
import { FacebookConversationAudienceRepositoryImpl } from './repositories/facebook-conversation-audience.repository.impl';
import { FacebookConversationProfile } from './profiles/facebook-conversation.profile';
import { FacebookConversationController } from './controllers/facebook-conversation.controller';
import { AuthModule } from '../auth/auth.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { FacebookPageModule } from '../facebook-pages/facebook-page.module';
import { FacebookMessageSubscriber } from './subcribers/message.subcriber';
import { FacebookConversationGateway } from './facebook-conversation.gateway';

const providers = [
    { provide: FacebookConversationService, useClass: FacebookConversationServiceImpl },
    FacebookConversationProfile,
    FacebookMessageSubscriber,
    FacebookConversationGateway
];
const repositories = [
    { provide: FacebookConversationRepository, useClass: FacebookConversationRepositoryImpl },
    { provide: FacebookConversationMessageRepository, useClass: FacebookConversationMessageRepositoryImpl },
    { provide: FacebookConversationAudienceRepository, useClass: FacebookConversationAudienceRepositoryImpl }
]

@Module({
    imports: [
        SharedModule,
        TerminusModule,
        forwardRef(() => AuthModule),
        forwardRef(() => FacebookPageModule),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TenantModule,
        FacebookExternalModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            FacebookConversationEntity,
            FacebookConversationMessageEntity,
            FacebookConversationAudienceEntity
        ]),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
    ],
    controllers: [FacebookConversationController],
    providers: [TypeOrmHealthIndicator, ...providers, ...repositories],
    exports: [...providers],
})
export class FacebookConversationModule { }
