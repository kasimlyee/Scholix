import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileUploadOptions } from './config/upload.config';

@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Create a new student
  @Post()
  async createStudent(
    @Body()
    body: {
      idNumber: string;
      firstName: string;
      lastName: string;
      age: number;
      email: string;
      phoneNumber: string;
      enrolledClass: string;
      parentName: string;
      parentPhoneNumner: string;
      parentEmail: string;
      address: string;
    },
  ) {
    return this.studentService.createStudent(
      body.idNumber,
      body.firstName,
      body.lastName,
      body.age,
      body.email,
      body.phoneNumber,
      body.enrolledClass,
      body.parentName,
      body.parentPhoneNumner,
      body.parentEmail,
      body.address,
    );
  }

  //get all students
  @Get()
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  //get student by id
  @Get(':idNumber')
  async getStudentById(@Param('idNumber') idNumber: string) {
    return this.studentService.getStudentById(idNumber);
  }

  //get Students by class
  @Get('class/:enrolledClass')
  async getStudentsByClass(@Param('enrolledClass') enrolledClass: string) {
    return this.studentService.getStudentsByClass(enrolledClass);
  }

  //update student details
  @Put(':idNumber')
  async updateStudent(
    @Param('idNumber') idNumber: string,
    @Body()
    body: {
      firstName?: string;
      lastName?: string;
      age?: number;
      email?: string;
      phoneNumber?: string;
      enrolledClass?: string;
      parentName?: string;
      parentPhoneNumner?: string;
      parentEmail?: string;
      address?: string;
    },
  ) {
    return this.studentService.updateStudent(
      idNumber,
      body.firstName,
      body.lastName,
      body.age,
      body.email,
      body.phoneNumber,
      body.enrolledClass,
      body.parentName,
      body.parentPhoneNumner,
      body.parentEmail,
      body.address,
    );
  }

  //delelte student
  //@Delete(':id')
  //async deleteStudent(@Param('id') id:number){
  //return this.studentService.deleteStudent(id)
  //}

  //uploading students
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', excelFileUploadOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.studentService.uploadStudentsFromFile(file);
  }
}
