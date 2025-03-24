import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  location: string;

  @Column()
  isActive: boolean;
}
