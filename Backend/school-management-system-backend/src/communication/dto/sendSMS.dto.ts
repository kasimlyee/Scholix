import { IsPhoneNumber, IsString } from 'class-validator';

export class SendSMSDto {
  @IsPhoneNumber()
  recipient: string;

  @IsString()
  message: string;
}
