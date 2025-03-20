import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from 'src/student/student.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { BioTimeMachineModule } from 'src/bio-time-machine/bio-time-machine.module';
import { CommunicationModule } from 'src/communication/communication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    StudentModule,
    TeachersModule,
    BioTimeMachineModule,
    CommunicationModule,
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
