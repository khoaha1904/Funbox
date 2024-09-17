import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
// import { MessageSubscriber } from './subcribers/message.subcriber';
// import { KafkaModule } from '@apps/modules/kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
	imports: [
		// KafkaModule,
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return {
					...dataSourceOptions,
					// subscribers: [MessageSubscriber], // Register the subscriber here
				};
			},
			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}
				return addTransactionalDataSource(new DataSource(options));
			},
		}),
		ClientsModule.register([
			{
				name: 'KAFKA_SERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						brokers: ['localhost:9092'], // Kafka broker address
					},
					consumer: {
						groupId: 'chat-consumer-group', // Consumer group ID
					},
				},
			},
		])
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {
	static forFeature(entities: any[], connectionName = 'default'): DynamicModule {
		return TypeOrmModule.forFeature(entities, connectionName);
	}
}
