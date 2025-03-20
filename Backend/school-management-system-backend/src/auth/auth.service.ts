import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //registering user
  async register(email: string, password: string, role: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new Error('User already exists');
    const user = await this.userService.createUser(
      email,
      password,
      role as UserRole,
    );

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); //6-digit otp code
    user.otpCode = otpCode;
    user.otpExpires = new Date();
    user.otpExpires.setMinutes(user.otpExpires.getMinutes() + 10); // expires in 10 minutes

    await this.userService.updateUser(user);
    await this.sendOTP(email, otpCode);

    return { message: 'User registered, please verify your email.' };
  }

  async verifyOTP(email: string, otpCode: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || user.otpCode !== otpCode || new Date() > user.otpExpires) {
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otpCode = '';
    user.otpExpires = new Date(0);
    await this.userService.updateUser(user);

    return { message: 'Email verified successfully!' };
  }

  //validating user
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        throw new Error('Email not verified');
      }
      return { email: user.email, role: user.role, id: user.id };
    }
    throw new UnauthorizedException('Invalid Credentials');
  }

  //login user
  async login(user: any) {
    const paylod = { email: user.email, role: user.role, id: user.id };
    return { access_token: this.jwtService.sign(paylod) };
  }

  async sendOTP(email: string, otpCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP code is: ${otpCode}`,
    });
  }
}
