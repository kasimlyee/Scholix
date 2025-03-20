import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import * as xlsx from 'xlsx';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  //creating a student
  async createStudent(
    idNumber: string,
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    phoneNumber: string,
    enrolledClass: string,
    parentName: string,
    parentPhoneNumner: string,
    parentEmail: string,
    address: string,
  ): Promise<Student> {
    const student = this.studentRepo.create({
      idNumber,
      firstName,
      lastName,
      age,
      email,
      phoneNumber,
      enrolledClass,
      parentName,
      parentPhoneNumner,
      parentEmail,
      address,
    });
    return this.studentRepo.save(student);
  }

  //Get all Students
  async getAllStudents(): Promise<Student[]> {
    return this.studentRepo.find({ relations: ['enrolledClass'] });
  }

  //Geting a student by Id
  async getStudentById(idNumber: string): Promise<Student | null> {
    return this.studentRepo.findOne({
      where: { idNumber },
    });
  }

  //Getting students by class
  async getStudentsByClass(enrolledClass: string) {
    console.log('Received class filter:', enrolledClass);
    const cleanClass = enrolledClass.replace(/^:/, '');
    const students = await this.studentRepo.find({
      where: { enrolledClass: cleanClass }, // Ensure it's correctly compared
    });

    console.log('Students found:', students);
    return students;
  }

  //Updating a student's details
  async updateStudent(
    idNumber: string,
    firstName?: string,
    lastName?: string,
    age?: number,
    email?: string,
    phoneNumber?: string,
    enrolledClass?: string,
    parentName?: string,
    parentPhoneNumner?: string,
    parentEmail?: string,
    address?: string,
  ): Promise<Student | null> {
    const student = await this.studentRepo.findOne({ where: { idNumber } });

    if (!student) return null;
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (age) student.age = age;
    if (email) student.email = email;
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (enrolledClass) student.enrolledClass = enrolledClass;
    if (parentName) student.parentName = parentName;
    if (parentPhoneNumner) student.parentPhoneNumner = parentPhoneNumner;
    if (parentEmail) student.parentEmail = parentEmail;
    if (address) student.address = address;

    return this.studentRepo.save(student);
  }

  //Deleting a student
  //async deleteStudent(id: number): Promise<boolean>{
  // const result = await this.studentRepo.delete(id);
  // return result.affected > 0;
  // }

  //upload students from excel file
  async uploadStudentsFromFile(file: Express.Multer.File): Promise<string> {
    //reading the file
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    //converting data into JSON
    interface StudentData {
      idNumber: string;
      firstName: string;
      lastName: string;
      age: number;
      email: string;
      phoneNumber: string;
      enrolledClass: string;
      parentName: string;
      parentPhoneNumner: string;
      parentEmail: string;
      address: string;
    }

    const studentData: StudentData[] =
      xlsx.utils.sheet_to_json<StudentData>(sheet);

    //inserting into the the database
    const students = studentData.map((student) =>
      this.studentRepo.create(student),
    );
    await this.studentRepo.save(students);

    return `${students.length} students uploaded successfully!`;
  }

  async findByCardId(cardId: string) {
    return this.studentRepo.findOne({ where: { idNumber: cardId } });
  }
}
