import { IsString, IsNumber } from 'class-validator';

export class CreateAcademicRecordDto {
  @IsString()
  subject: string;

  @IsNumber()
  grade: number;

  @IsString()
  semester: string;

  @IsNumber()
  year: number;
}
