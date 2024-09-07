import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { FacebookMessageModule } from '../facebook-message/facebook-message.module';
// import { DatabaseModule } from '@apps/core-service/databases/database.module';
// import { UsersRepository } from './repositories/users.repository';
// import { UsersRepositoryImpl } from './repositories/users.repository.impl';
// import { UsersService } from './services/users.service';
// import { UsersServiceImpl } from './services/users.service.impl';
import { UserEntity } from './entities/user.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { SharedModule } from '@libs/shared/services/shared-service.module';
import { UsersService } from './services/user.service';
import { UsersServiceImpl } from './services/user.service.impl';
import { UsersRepository } from './repositories/user.repository';
import { UsersRepositoryImpl } from './repositories/user.repository.impl';
import { UserProfile } from './mappers/user.profile';
import { DatabaseModule } from 'src/databases/database.module';
// import { UsersController } from './controllers/users.controller';

const services = [
	{
		provide: UsersService,
		useClass: UsersServiceImpl,
	},
];
const providers = [
	{
		provide: UsersRepository,
		useClass: UsersRepositoryImpl,
	},
	UserProfile
];

@Module({
	imports: [
		SharedModule,
		// FacebookMessageModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
		DatabaseModule,
		DatabaseModule.forFeature([UserEntity]),
	],
	// controllers: [UsersController],
	providers: [...providers, ...services],
	exports: [...services],
})
export class UsersModule { }
