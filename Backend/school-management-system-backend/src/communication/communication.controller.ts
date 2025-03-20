import { Controller, Body, Post, Get } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { SendSMSDto } from './dto/sendSMS.dto';

@Controller('comm')
export class CommunicationController {
  constructor(private readonly commService: CommunicationService) {}

  @Post('email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.commService.sendEmail(
      sendEmailDto.recipient,
      sendEmailDto.subject,
      sendEmailDto.message,
    );
  }

  @Post('sms')
  async sendSMS(@Body() sendSMSDto: SendSMSDto) {
    return this.commService.sendSMS(sendSMSDto.recipient, sendSMSDto.message);
  }

  @Get()
  async getNotifications() {
    return this.commService.getNotifications();
  }
}
