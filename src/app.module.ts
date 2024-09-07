import { Module } from '@nestjs/common';
import { SharedModule } from './shared/services/shared-service.module';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from '@apps/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './modules/tenants/tenant.module';

@Module({
	imports: [SharedModule, UsersModule, AuthModule, TenantModule, ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: '.env',
	}),],
	controllers: [],
	providers: [],
})
export class AppModule { }
