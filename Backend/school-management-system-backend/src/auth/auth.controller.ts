import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      role?: 'admin' | 'Librarian' | 'DOS' | 'Bursar' | 'Staff';
    },
  ) {
    return this.userService.createUser(
      body.email,
      body.password,
      body.role || 'Staff',
    );
  }

  @Post('verify-email')
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOTP(body.email, body.otp);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService
      .validateUser(body.email, body.password)
      .then((user) => this.authService.login(user));
  }
}
