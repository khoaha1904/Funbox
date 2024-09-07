import { AppConfigService } from '@libs/shared/services';
import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { RedisOptions } from 'ioredis';
import { AppCacheService } from './cache.service';
import { SharedModule } from '@libs/shared/services/shared-service.module';

@Module({
	imports: [],
	providers: [],
	exports: [],
})
export class AppCacheModule {
	static forRoot(options: RedisOptions): DynamicModule {
		return {
			module: AppCacheModule,
			imports: [RedisModule.forRoot({ type: 'single', options })],
			providers: [AppCacheService],
			exports: [AppCacheService],
		};
	}

	static forRootAsync(options: {
		useFactory: (...args: any[]) => RedisOptions;
		inject?: any[];
		imports?: any[];
	}): DynamicModule {
		const { useFactory, inject, imports } = options;
		return {
			module: AppCacheModule,
			imports: [
				...imports,
				RedisModule.forRootAsync({
					imports: [SharedModule],
					useFactory: (...args): RedisModuleOptions => {
						const redisOptions: RedisOptions = useFactory(...args);
						return { type: 'single', options: redisOptions };
					},
					inject: [AppConfigService],
				}),
			],
			providers: [AppCacheService, ...inject],
			exports: [AppCacheService],
		};
	}
}
