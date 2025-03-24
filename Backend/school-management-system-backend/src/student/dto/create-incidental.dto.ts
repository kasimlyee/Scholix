// create-incident.dto.ts
import { IsString, IsEnum } from 'class-validator';

export class CreateIncidentDto {
  @IsEnum(['behavioral', 'academic', 'safety'])
  type: 'behavioral' | 'academic' | 'safety';

  @IsString()
  description: string;

  @IsEnum(['low', 'medium', 'high'])
  severity: 'low' | 'medium' | 'high';
}
