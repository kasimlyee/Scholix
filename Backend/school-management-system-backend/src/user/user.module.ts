import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { User } from '../user/user.entity';
import { JwtStrategy } from '../auth/JWT-auth-guards/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
