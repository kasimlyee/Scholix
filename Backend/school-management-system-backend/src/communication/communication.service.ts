import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification/notification.entity';
import { EmailService } from './notification/email.service';
import { SmsService } from './notification/sms.service';
import { PushNotificationService } from './notification/push-notification.service';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushNotificationService,
  ) {}

  async sendEmail(
    recipient: string,
    subject: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      type: 'email',
      recipient,
      message: `${subject}: ${message}`,
      status: 'pending',
    });

    await this.notificationRepo.save(notification);

    try {
      await this.emailService.sendEmail(recipient, subject, message);
      notification.status = 'sent';
    } catch (error) {
      notification.status = 'failed';
      throw new Error(`Failed to send email ${error}`);
    } finally {
      await this.notificationRepo.save(notification);
    }
    return notification;
  }

  async sendSMS(recipient: string, message: string): Promise<Notification> {
    const notification = this.notificationRepo.create({
      type: 'sms',
      recipient,
      message,
      status: 'pending',
    });

    await this.notificationRepo.save(notification);

    try {
      await this.smsService.sendSMS(recipient, message);
      notification.status = 'sent';
    } catch (error) {
      notification.status = 'failed';
      throw new Error(`Failed to send SMS ${error}`);
    } finally {
      await this.notificationRepo.save(notification);
    }
    return notification;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notificationRepo.find();
  }
}
