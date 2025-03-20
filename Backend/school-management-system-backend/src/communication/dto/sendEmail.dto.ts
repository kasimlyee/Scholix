import {IsEmail, IsString} from 'class-validator';
export class SendEmailDto{

    @IsEmail()
    recipient: string;

    @IsString()
    subject: string;

    @IsString()
    message: string;
}