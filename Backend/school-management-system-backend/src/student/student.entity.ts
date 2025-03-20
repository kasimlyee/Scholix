import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Class } from './classes/class.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Entity({ name: 'student' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  idNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  enrolledClass: string;

  @Column()
  parentName: string;

  @Column()
  parentPhoneNumner: string;

  @Column()
  parentEmail: string;

  @Column()
  address: string;
}
