import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  phoneNumber: string;

  @Column()
  enrolledClass: string;

  @Column()
  parentName: string;

  @Column()
  parentPhoneNumber: string;

  @Column()
  admissionDate: string;

  @Column('json', { default: [] })
  medicalHistory: MedicalRecord[];

  @Column('json', { default: [] })
  academicHistory: AcademicRecord[];

  @Column('json', { default: [] })
  attendance: AttendanceRecord[];

  @Column('json', { default: [] })
  incidents: Incident[];

  @Column({ default: 0 })
  points: number;
}

export interface MedicalRecord {
  id: string;
  condition: string;
  date: string;
  notes: string;
  emergencyLevel: 'low' | 'medium' | 'high';
}

export interface AcademicRecord {
  subject: string;
  grade: number;
  semester: string;
  year: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Incident {
  id: string;
  type: 'behavioral' | 'academic' | 'safety';
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'pending' | 'resolved' | 'in-progress';
}
