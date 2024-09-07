import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppConfigService } from './app-config.service';
import { AppLoggerService } from './app-logger.service';

@Injectable()
export class AppMailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly loggerService: AppLoggerService,
		private readonly configService: AppConfigService
	) {}

	async send<T>(email: string, subject: string, template: string, context: T) {
		try {
			await this.mailerService.sendMail({
				to: email,
				subject: subject,
				// template: './verify-create',
				template: template,
				context: context,
			});
			return true;
		} catch (e) {
			this.loggerService.error(e);
			return false;
		}
	}
}
