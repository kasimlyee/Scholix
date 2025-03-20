import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Device } from 'src/bio-time-machine/device.entity';

export enum PersonType {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PersonType })
  personType: PersonType;

  @Column()
  personId: string;

  @Column()
  direction: 'in' | 'out';

  @Column({ type: 'timestamp' })
  swipeTime: Date;

  @ManyToOne(() => Device)
  device: Device;
}
