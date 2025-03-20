import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async sendSMS(phoneNumber: string, message: string) {
    const urlAPI = this.configService.get('SMS_URL');
    const username = this.configService.get<string>('SMS_USERNAME');
    const userpass = this.configService.get<string>('SMS_PASS');

    const payload = {
      method: 'SendSms',
      userdata: {
        username: username,
        password: userpass,
      },
      msgdata: [
        {
          number: phoneNumber,
          message: message,
          senderid: 'Naalya SS',
          priority: '0',
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(urlAPI, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      console.log('SMS sent:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending SMS: ${error}`);
      throw new Error(`Failed to send SMS ${error.message}`);
    }
  }
}
