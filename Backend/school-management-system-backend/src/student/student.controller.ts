import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentService } from './student.service';
import { CreateAcademicRecordDto } from './dto/create-academic-record.dto';
import { CreateStudentDto } from './dto/student.dto';
import { UpdateIncidentDto } from './dto/incidental.dto';
import { CreateIncidentDto } from './dto/create-incidental.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateMedicalRecordDto } from './dto/create-modal-record.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentsService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get('class/:className')
  findByClass(@Param('className') className: string) {
    return this.studentsService.findByClass(className);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadStudents(@UploadedFile() file: Express.Multer.File) {
    return this.studentsService.uploadStudents(file);
  }

  @Patch(':id/points')
  updatePoints(
    @Param('id') id: string,
    @Body() body: { points: number; reason: string },
  ) {
    return this.studentsService.updatePoints(id, body.points, body.reason);
  }

  @Post(':id/incidents')
  addIncident(@Param('id') id: string, @Body() incidentDto: CreateIncidentDto) {
    return this.studentsService.addIncident(id, incidentDto);
  }

  @Patch(':id/incidents/:incidentId')
  updateIncidentStatus(
    @Param('id') id: string,
    @Param('incidentId') incidentId: string,
    @Body() updateDto: UpdateIncidentDto,
  ) {
    return this.studentsService.updateIncidentStatus(id, incidentId, updateDto);
  }

  @Post(':id/notify')
  notifyParent(@Param('id') id: string, @Body() body: { incidentId: string }) {
    return this.studentsService.notifyParent(id, body.incidentId);
  }

  @Post('bulk-notify')
  bulkNotify(@Body() body: { studentIds: string[] }) {
    return this.studentsService.bulkNotify(body.studentIds);
  }

  @Post(':id/attendance')
  addAttendance(
    @Param('id') id: string,
    @Body() attendanceDto: CreateAttendanceDto,
  ) {
    return this.studentsService.addAttendance(id, attendanceDto);
  }

  @Post(':id/academic')
  addAcademicRecord(
    @Param('id') id: string,
    @Body() academicDto: CreateAcademicRecordDto,
  ) {
    return this.studentsService.addAcademicRecord(id, academicDto);
  }

  @Post(':id/medical')
  addMedicalRecord(
    @Param('id') id: string,
    @Body() medicalDto: CreateMedicalRecordDto,
  ) {
    return this.studentsService.addMedicalRecord(id, medicalDto);
  }

  @Get(':id/attendance-report')
  getAttendanceReport(
    @Param('id') id: string,
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'monthly',
  ) {
    return this.studentsService.getAttendanceReport(id, period);
  }

  @Get(':id/subject-analysis')
  getSubjectStrengthWeakness(@Param('id') id: string) {
    return this.studentsService.getSubjectStrengthWeakness(id);
  }

  @Get(':id/behavior-trends')
  getBehaviorTrends(@Param('id') id: string) {
    return this.studentsService.getBehaviorTrends(id);
  }

  @Get('class-stats/:className')
  getClassStats(@Param('className') className: string) {
    return this.studentsService.getClassStats(className);
  }
}
