import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthServiceImpl } from './services/auth.service.impl';
import { AuthCacheService } from './cache/auth-cache.service';
import { AppConfigService, SharedModule } from '@libs/shared/services';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@apps/modules/users/user.module';
import { AuthController } from './controllers/auth.controller';
import { JwtLocalStrategy } from './strategies/jwt.strategy';
import { RedisOptions } from 'ioredis';
import { ConfigModule } from '@nestjs/config';
import { AppCacheModule } from 'src/caches/cache.module';
import { TenantModule } from '../tenants/tenant.module';

const services = [
	{
		provide: AuthService,
		useClass: AuthServiceImpl,
	},
];

const providers = [AuthCacheService, ...services];

@Module({
	imports: [
		SharedModule,
		// UserModule,
		PassportModule,
		TenantModule,
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		JwtModule.registerAsync({
			imports: [SharedModule],
			useFactory: async (configService: AppConfigService) => ({
				secret: configService.get('JWT_SECRET'),
			}),
			inject: [AppConfigService],
		}),
		AppCacheModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: AppConfigService): RedisOptions => {
				const options = {
					host: configService.get('REDIS_CORE_HOST'),
					username: configService.get('REDIS_CORE_USER'),
					password: configService.get('REDIS_CORE_PASSWORD'),
					port: configService.getNumber('REDIS_CORE_PORT'),
					db: configService.getNumber('REDIS_CORE_DB'),
				};
				return options;
			},
			inject: [AppConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [...providers, JwtLocalStrategy],
	exports: [...services, JwtLocalStrategy],
})
export class AuthModule { }
