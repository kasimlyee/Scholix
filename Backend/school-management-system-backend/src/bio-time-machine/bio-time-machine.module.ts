import { Module } from '@nestjs/common';
import { DeviceService } from './bio-time-machine.service';
import { BioTimeMachineController } from './bio-time-machine.controller';
import { StudentModule } from 'src/student/student.module';
import { Device } from './device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DeviceService],
  imports: [StudentModule, TypeOrmModule.forFeature([Device])],
  controllers: [BioTimeMachineController],
  exports: [DeviceService, TypeOrmModule],
})
export class BioTimeMachineModule {}
