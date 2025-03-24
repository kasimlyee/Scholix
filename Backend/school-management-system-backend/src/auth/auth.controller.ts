import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './JWT-auth-guards/jwt-auth.guards';
import { UnauthorizedException } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

// Define a custom interface for the request object with user property
interface AuthRequest extends ExpressRequest {
  user: {
    sub: string; // userId from JWT payload
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-verification')
  async sendVerification(@Body() body: { email: string }) {
    return this.authService.sendVerificationCode(body.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() body: { email: string; password: string; role: string },
    @Request() req: AuthRequest, // Explicitly type req
  ) {
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException('Only Admin can register users');
    }
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: AuthRequest) {
    // Explicitly type req
    await this.authService.logout(req.user.sub);
    return { message: 'Logged out successfully' };
  }

  @Get('available-roles')
  @UseGuards(JwtAuthGuard)
  async getAvailableRoles(@Request() req: AuthRequest) {
    // Explicitly type req
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException('Only Admin can view available roles');
    }
    return this.authService.getAvailableRoles();
  }

  @Get('logged-in-users')
  @UseGuards(JwtAuthGuard)
  async getLoggedInUsers(@Request() req: AuthRequest) {
    // Explicitly type req
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException('Only Admin can view logged-in users');
    }
    return this.authService.getLoggedInUsers();
  }
}
