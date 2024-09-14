import { Module } from '@nestjs/common';
import { SharedModule } from './shared/services/shared-service.module';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from '@apps/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './modules/tenants/tenant.module';
import { AppController } from './app.controller';
import { FacebookPageModule } from './modules/facebook-pages/facebook-page.module';
import { FacebookConversationModule } from './modules/facebook-conversations/facebook-conversastion.module';

@Module({
	imports: [
		SharedModule,
		UsersModule,
		AuthModule,
		TenantModule,
		FacebookPageModule,
		FacebookConversationModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),],
	controllers: [AppController],
	providers: [],
})
export class AppModule { }
