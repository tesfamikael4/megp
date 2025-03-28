import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(email: string, subject: string, body: string) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: body,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
