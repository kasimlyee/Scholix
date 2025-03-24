// create-student.dto.ts
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  age: number;

  @IsString()
  phoneNumber: string;

  @IsString()
  enrolledClass: string;

  @IsString()
  parentName: string;

  @IsString()
  parentPhoneNumber: string;

  @IsDateString()
  admissionDate: string;
}

