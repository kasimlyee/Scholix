import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { Device } from 'src/bio-time-machine/device.entity';
import { StudentService } from 'src/student/student.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { CommunicationService } from 'src/communication/communication.service';
import { DeviceService } from 'src/bio-time-machine/bio-time-machine.service';
import { SwipeEventDto } from './dto/swipe-event.dto';
import { PersonType } from './attendance.entity';
import { clearInterval } from 'timers';
import { Swipe } from './dto/swipe.dto';

@Injectable()
export class AttendanceService implements OnModuleInit, OnModuleDestroy {
  private pollingInterval: NodeJS.Timeout;
  private lastPollTime: Date = new Date(0);
  private readonly POLL_INTERVAL = 200000;
  private isPollingActive = false;
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    private studentService: StudentService,
    private teacherService: TeachersService,
    private communicationService: CommunicationService,
    private deviceService: DeviceService,
  ) {}
  async onModuleInit() {
    await this.startPolling();
  }
  onModuleDestroy() {
    this.stopPolling();
  }

  async processSwipeEvent(swipeEvent: SwipeEventDto) {
    // Validate device is main gate
    const device = await this.deviceRepo.findOne({
      where: { deviceId: swipeEvent.deviceId },
    });

    if (!device || device.location !== 'main_gate') {
      console.log('Device not found or not main gate');
      return { status: 'error', message: 'Device not found or not main gate' };
    }

    // Find person by card Id
    const [student, teacher] = await Promise.all([
      this.studentService.findByCardId(swipeEvent.cardId),
      this.teacherService.findByCardId(swipeEvent.cardId),
    ]);

    const person = student || teacher;
    if (!person) {
      throw new Error('Card not registered');
    }

    // Determine direction based on last record
    const lastRecord = await this.attendanceRepo.findOne({
      where: {
        personId: person.id.toString(),
        personType: student ? PersonType.STUDENT : PersonType.TEACHER,
      },
      order: { swipeTime: 'DESC' },
    });

    const direction =
      !lastRecord || lastRecord.direction === 'out' ? 'in' : 'out';

    const attendanceRecord = this.attendanceRepo.create({
      personType: student ? PersonType.STUDENT : PersonType.TEACHER,
      personId: person.id.toString(),
      direction,
      swipeTime: swipeEvent.swipeTime,
      device,
    });

    await this.attendanceRepo.save(attendanceRecord);

    // Sending notification
    if (student) {
      const message = `Your child ${student.firstName} ${student.lastName} has ${direction === 'in' ? 'arrived at' : 'left'} school at ${swipeEvent.swipeTime}`;
      const phoneNumber = student.parentPhoneNumner;
      await this.communicationService.sendSMS(phoneNumber, message);
    }

    return { status: 'success', direction };
  }

  async startPolling() {
    if (this.isPollingActive) return;

    console.log('Starting Polling.....');
    this.isPollingActive = true;

    this.pollingInterval = setInterval(async () => {
      try {
        await this.pollSwipes();
      } catch (error) {
        console.error(`An error occurred: ${error}`);
      }
    }, this.POLL_INTERVAL);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.isPollingActive = false;
      console.log('Swipe polling stopped');
    }
  }

  private async pollSwipes() {
    const ipAddress = 'http://localhost:8843';
    const username = 'Kasim';
    const password = '@Kas!m1223';

    try {
      const swipes = await this.deviceService.getTransactions(
        ipAddress,
        username,
        password,
      );

      if (swipes.length > 0) {
        console.log(`Processing ${swipes.length} new swipes`);

        //process swipes in parallel with error handling

        await Promise.all(
          swipes.map(async (swipe: Swipe) => {
            try {
              const swipeEvent: SwipeEventDto = {
                deviceId: swipe.terminal_sn,
                cardId: swipe.emp_code,
                swipeTime: new Date(swipe.punch_time * 1000), // UNIX timestamp
              };
              await this.processSwipeEvent(swipeEvent);
            } catch (processError) {
              console.error(
                `Failed to process swipe: ${(processError as Error).message}`,
              );
            }
          }),
        );
        this.updateLastPollTime();
      }
    } catch (error) {
      console.error(`Polling cycle failed: ${error.message}`);
      await this.handlePollingError(error);
    }
  }
  updateLastPollTime() {
    this.lastPollTime = new Date();
  }

  getLastPollTime() {
    return this.lastPollTime;
  }

  private async handlePollingError(error: Error) {
    console.log(`Attempting to reconnect......`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.startPolling();
  }
}
