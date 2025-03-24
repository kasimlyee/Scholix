import { IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsString()
  condition: string;

  @IsDateString()
  date: string;

  @IsString()
  notes: string;

  @IsEnum(['low', 'medium', 'high'])
  emergencyLevel: 'low' | 'medium' | 'high';
}
