import { IsDateString, IsEnum } from 'class-validator';

export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsEnum(['present', 'absent', 'late'])
  status: 'present' | 'absent' | 'late';
}
