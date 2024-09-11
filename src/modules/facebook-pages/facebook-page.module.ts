import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppConfigService, SharedModule } from '@libs/shared/services';
import { FacebookPageService } from './services/facebook-page.service';
import { FacebookPageServiceImpl } from './services/facebook-page.service.impl';
import { TenantModule } from '../tenants/tenant.module';
import { FacebookExternalModule } from '@apps/externals/facebook-externals/facebook.external.module';
import { FacebookPageController } from './controllers/facebook-page.controller';
import { DatabaseModule } from '@apps/databases/database.module';
import { FacebookPageEntity } from './entities/facebook-page.entity';
import { FacebookPageRepository } from './repositories/facebook-page.repository';
import { FacebookPageRepositoryImpl } from './repositories/facebook-page.repository.impl';

const providers = [{ provide: FacebookPageService, useClass: FacebookPageServiceImpl }];
const repositories = [{ provide: FacebookPageRepository, useClass: FacebookPageRepositoryImpl }]

@Module({
	imports: [
		SharedModule,
		TerminusModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TenantModule,
		FacebookExternalModule,
		DatabaseModule,
		DatabaseModule.forFeature([FacebookPageEntity])
	],
	controllers: [FacebookPageController],
	providers: [TypeOrmHealthIndicator, ...providers, ...repositories],
	exports: [...providers],
})
export class FacebookPageModule { }
