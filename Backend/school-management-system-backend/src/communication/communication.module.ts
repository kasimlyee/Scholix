import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification/notification.entity';
import { EmailService } from './notification/email.service';
import { SmsService } from './notification/sms.service';
import { PushNotificationService } from './notification/push-notification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), HttpModule, ConfigModule],
  providers: [
    CommunicationService,
    EmailService,
    SmsService,
    PushNotificationService,
  ],
  controllers: [CommunicationController],
  exports: [CommunicationService, TypeOrmModule],
})
export class CommunicationModule {}
