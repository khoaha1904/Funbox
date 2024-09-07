import { Module } from '@nestjs/common';
import { AppConfigService, AppLoggerService, UtilService } from '.';
import { AppAxiosService } from './app-axios.service';
import { HttpModule } from '@nestjs/axios';
// import { AppMailService } from './app-mail.service';
// import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppMailService } from './app-mail.service';

const libraries = () => [
	MailerModule.forRootAsync({
		imports: [SharedModule],
		useFactory: async (configService: AppConfigService) => ({
			transport: {
				host: configService.mail.host,
				secure: false,
				auth: {
					user: configService.mail.user,
					pass: configService.mail.pass,
				},
			},
			defaults: {
				from: `"No Reply" <${configService.mail.from}`,
			},
			template: {
				dir: join(__dirname, '../templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
		inject: [AppConfigService],
	}),
	HttpModule.register({
		timeout: 5000,
		maxRedirects: 5,
	}),
];

const services = [AppConfigService, AppLoggerService, UtilService, AppMailService, AppAxiosService];

@Module({
	imports: [...libraries()],
	providers: [...services],
	exports: [...services],
})
export class SharedModule { }
