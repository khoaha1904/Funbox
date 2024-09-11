import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService, AppLoggerService } from '@libs/shared/services';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);

	const configService = app.get(AppConfigService);
	const loggerService = app.get(AppLoggerService);
	app.useLogger(loggerService);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			// whitelist: true,
			validationError: {
				target: false,
			},
		})
	);

	app.use(
		morgan('combined', {
			stream: {
				write: (message) => {
					loggerService.log(message);
				},
			},
		})
	);

	app.use(
		helmet({
			crossOriginResourcePolicy: false,
		})
	);

	// app.use('/uploads', express.static(join(__dirname, '../../../../..', 'uploads')));

	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	const port = configService.get('PORT') || 3000;
	const corsOptions = {
		origin: '*',
		method: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
		credential: false,
		allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN, X-TENANT',
	};
	app.use(cors(corsOptions));

	await app.listen(port);

	return { port, logger: loggerService };
}

bootstrap().then((res: any) => {
	res.logger.debug(`Server is running on port http://localhost:${res.port}`);
});
