import { Controller, Body, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SwipeEventDto } from './dto/swipe-event.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async handleSwipe(@Body() swipEvent: SwipeEventDto) {
    return this.attendanceService.processSwipeEvent(swipEvent);
  }
}
