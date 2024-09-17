import { AppLoggerService } from '@libs/shared/services';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService implements OnModuleInit {

    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
        private readonly _loggerService: AppLoggerService
    ) {
        console.log('test', this.kafkaClient)
    }

    async onModuleInit() {
        try {
            await this.kafkaClient.connect();
            console.log('Kafka client connected');
        } catch (error) {
            console.log('Kafka client connection failed', error);
        }
    }

    async sendKafkaMessage(topic: string, message: any) {
        console.log('client', this.kafkaClient)
        try {
            this.kafkaClient.send(topic, message);
        } catch (error) {
            this._loggerService.error(KafkaProducerService.name, `Failed to send message to topic ${topic}`, error.stack);
        }
    }
}