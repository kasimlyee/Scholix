import { IsString } from 'class-validator';

export class SendPushDto {
  @IsString()
  recipient: string;

  @IsString()
  title: string;

  @IsString()
  body: string;
}
