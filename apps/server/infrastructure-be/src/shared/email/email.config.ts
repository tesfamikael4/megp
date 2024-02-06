import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfig implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: process.env.EMAIL_SMTP,
        port: Number(process.env.EMAIL_SMTP_PORT),
        // secure: process.env.EMAIL_SMTP_SECURE,
        auth: {
          user: process.env.EMAIL_SMTP_USERNAME,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.EMAIL_SMTP_DISPLAY_NAME}" <${process.env.EMAIL_SMTP_USERNAME}>`,
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    };
  }
}
