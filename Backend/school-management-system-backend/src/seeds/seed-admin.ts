import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'; // Import dotenv to load .env
import { User, UserRole } from '../user/user.entity';

// Load environment variables from .env file
dotenv.config();

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const adminEmail = 'kasiimlyee@gmail.com'; // Change to your desired Admin email
  const adminPassword = 'Admin@53787'; // Change to a secure password

  // Check if Admin already exists
  const existingAdmin = await userRepository.findOneBy({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin already exists:', adminEmail);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create the Admin user
  const admin = userRepository.create({
    email: adminEmail,
    password: hashedPassword,
    role: 'Admin' as UserRole,
    isVerified: true, // Skip email verification for initial Admin
    isLoggedIn: false,
    verificationCode: '',
  });

  await userRepository.save(admin);
  console.log('Initial Admin created:', adminEmail);
}

// PostgreSQL DataSource configuration using DATABASE_URL
const dataSource = new DataSource({
  type: 'postgres', // Specify type as postgres
  url: process.env.DATABASE_URL, // Use DATABASE_URL from .env
  entities: ['src/**/*.entity{.ts,.js}'], // Path to your entities
  synchronize: false, // Set to false to avoid schema changes
});

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');
    await seedAdmin(dataSource);
  } catch (error) {
    console.error('Error seeding Admin:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

runSeed();
