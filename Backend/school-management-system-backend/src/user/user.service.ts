import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    role: UserRole = 'Staff',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      isLoggedIn: false,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByRole(role: UserRole): Promise<User | null> {
    return this.userRepository.findOneBy({ role });
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // Expose repository for convenience in AuthService
  get repository(): Repository<User> {
    return this.userRepository;
  }
}
