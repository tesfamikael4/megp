import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfig } from './email.config';

@Module({
  imports: [MailerModule.forRootAsync({ useClass: EmailConfig })],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
