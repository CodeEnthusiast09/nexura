// src/common/email/email.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    // Placeholder for dev
    this.logger.log(`Pretending to send email to: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.debug(html);

    // Later: hook in nodemailer / sendgrid / mailgun here
  }
}
