// import { Module } from '@nestjs/common';
// import { SharedModule } from '@libs/shared/services';
// import { KafkaProducerService } from './kafka.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//     imports: [
//         SharedModule,
//         ClientsModule.register([
//             {
//                 name: 'KAFKA_SERVICE',
//                 transport: Transport.KAFKA,
//                 options: {
//                     client: {
//                         brokers: ['localhost:9092'], // Kafka broker address
//                     },
//                     consumer: {
//                         groupId: 'chat-consumer-group', // Consumer group ID
//                     },
//                 },
//             },
//         ])
//     ],
//     providers: [KafkaProducerService],
//     exports: [KafkaProducerService],
// })
// export class KafkaModule { }
