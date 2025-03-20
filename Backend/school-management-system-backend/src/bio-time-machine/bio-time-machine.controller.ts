import { Controller, Get, Query } from '@nestjs/common';
import { DeviceService } from './bio-time-machine.service';

@Controller('api/device')
export class BioTimeMachineController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('card')
  async getUserDetails(
    @Query('ip') ip: string,
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return await this.deviceService.getUserDetails(ip, username, password);
  }
}
