import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role-based -guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { message: 'Protected route accessed!' };
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('admin')
  getAdminData() {
    return { message: 'Admin data accessed!' };
  }
}
