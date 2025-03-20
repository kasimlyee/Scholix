import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'Librarian' | 'DOS' | 'Bursar' | 'Staff';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  otpCode: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'Librarian', 'DOS', 'Bursar', 'Staff'],
    default: 'Staff',
  })
  role: UserRole;

  @Column({ nullable: true })
  otpExpires: Date;
}
