// update-incident.dto.ts
import { IsEnum } from 'class-validator';

export class UpdateIncidentDto {
  @IsEnum(['pending', 'resolved', 'in-progress'])
  status: 'pending' | 'resolved' | 'in-progress';
}

