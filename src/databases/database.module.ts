import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return dataSourceOptions;
			},
			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}
				return addTransactionalDataSource(new DataSource(options));
			},
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {
	static forFeature(entities: any[], connectionName = 'default'): DynamicModule {
		return TypeOrmModule.forFeature(entities, connectionName);
	}
}
