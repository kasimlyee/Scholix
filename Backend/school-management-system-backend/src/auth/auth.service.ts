import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service'; // Ensure correct path
import { User, UserRole } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async sendVerificationCode(email: string): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
      throw new UnauthorizedException('Email already registered and verified');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    let user = existingUser;
    if (!user) {
      user = await this.userService.createUser(email, '', 'Staff'); // Temp role, password will be set later
    }
    user.verificationCode = code;
    await this.userService.updateUser(user);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`,
    });
  }

  async verifyEmail(
    email: string,
    code: string,
  ): Promise<{ verified: boolean }> {
    const user = await this.userService.findByEmail(email);
    if (user && user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = ''; // Set to null instead of empty string for consistency
      await this.userService.updateUser(user);
      return { verified: true };
    }
    return { verified: false };
  }

  async register(email: string, password: string, role: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const validRoles: UserRole[] = [
      'Admin',
      'Librarian',
      'Bursar',
      'DOS',
      'Staff',
    ];
    if (!validRoles.includes(role as UserRole)) {
      throw new UnauthorizedException('Invalid role');
    }

    const roleCheck = await this.userService.findByRole(role as UserRole);
    if (roleCheck) {
      throw new UnauthorizedException(`Role ${role} is already assigned`);
    }

    user.password = await bcrypt.hash(password, 10);
    user.role = role as User['role'];
    await this.userService.updateUser(user);
    return this.login(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      user.isVerified &&
      (await bcrypt.compare(pass, user.password))
    ) {
      user.isLoggedIn = true;
      await this.userService.updateUser(user);
      const { password, verificationCode, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async logout(userId: string) {
    // Assuming userId is the UUID from JWT payload (not email)
    const user = await this.userService.repository.findOneBy({ id: userId });
    if (user) {
      user.isLoggedIn = false;
      await this.userService.updateUser(user);
    }
  }

  async getAvailableRoles(): Promise<string[]> {
    const allRoles: UserRole[] = [
      'Admin',
      'Librarian',
      'Bursar',
      'DOS',
      'Staff',
    ];
    const usedRoles = await this.userService.repository.find({
      select: ['role'],
    });
    return allRoles.filter((role) => !usedRoles.some((u) => u.role === role));
  }

  async getLoggedInUsers(): Promise<User[]> {
    return this.userService.repository.find({ where: { isLoggedIn: true } });
  }
}
