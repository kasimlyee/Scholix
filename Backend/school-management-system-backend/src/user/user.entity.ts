import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'Admin' | 'Librarian' | 'Bursar' | 'DOS' | 'Staff';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['Admin', 'Librarian', 'Bursar', 'DOS', 'Staff'],
  })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: false })
  isLoggedIn: boolean;
}
