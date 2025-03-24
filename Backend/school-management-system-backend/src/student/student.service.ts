import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateAcademicRecordDto } from './dto/create-academic-record.dto';
import { CreateStudentDto } from './dto/student.dto';
import { UpdateIncidentDto } from './dto/incidental.dto';
import { CreateIncidentDto } from './dto/create-incidental.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateMedicalRecordDto } from './dto/create-modal-record.dto';
import * as XLSX from 'xlsx';
import { Incident } from './student.entity';
import { MedicalRecord } from './student.entity';
import { AttendanceRecord } from './student.entity';
import { AcademicRecord } from './student.entity';


@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentsRepository.create({
      ...createStudentDto,
      idNumber: `STU${Date.now()}${Math.floor(Math.random() * 1000)}`,
      points: 0,
      incidents: [],
      attendance: [],
      academicHistory: [],
      medicalHistory: [],
    });
    return this.studentsRepository.save(student);
  }

  async findByClass(className: string): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { enrolledClass: className },
    });
  }

  async findOne(id: string): Promise<Student> {
    return this.studentsRepository.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.studentsRepository.delete(id);
  }

  async uploadStudents(file: Express.Multer.File): Promise<void> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    const students = data.map((row) => ({
      ...row,
      idNumber: `STU${Date.now()}${Math.floor(Math.random() * 1000)}`,
      points: 0,
      incidents: [],
      attendance: [],
      academicHistory: [],
      medicalHistory: [],
    }));

    await this.studentsRepository.save(students);
  }

  async updatePoints(
    id: string,
    points: number,
    reason: string,
  ): Promise<Student> {
    const student = await this.findOne(id);
    student.points += points;
    // Log points history if needed
    return this.studentsRepository.save(student);
  }

  async addIncident(
    studentId: string,
    incidentDto: CreateIncidentDto,
  ): Promise<Incident> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const incident = {
      id: crypto.randomUUID(),
      ...incidentDto,
      date: new Date().toISOString(),
      status: 'pending' as const,
    };
    student.incidents.push(incident);
    await this.studentsRepository.save(student);
    return incident;
  }

  async updateIncidentStatus(
    studentId: string,
    incidentId: string,
    updateDto: UpdateIncidentDto,
  ): Promise<void> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    student.incidents = student.incidents.map((inc) =>
      inc.id === incidentId ? { ...inc, ...updateDto } : inc,
    );
    await this.studentsRepository.save(student);
  }

  async notifyParent(studentId: string, incidentId: string): Promise<void> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    console.log(
      `Notifying parent of ${student.parentName} about incident ${incidentId}`,
    );
  }

  async bulkNotify(studentIds: string[]): Promise<void> {
    const students = await this.studentsRepository.findByIds(studentIds);
    students.forEach((student) => {
      console.log(`Notifying parent of ${student.parentName} for bulk action`);
    });
  }

  async addAttendance(
    studentId: string,
    attendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceRecord> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const attendanceRecord = { ...attendanceDto };
    student.attendance.push(attendanceRecord);
    await this.studentsRepository.save(student);
    return attendanceRecord;
  }

  async addAcademicRecord(
    studentId: string,
    academicDto: CreateAcademicRecordDto,
  ): Promise<AcademicRecord> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const academicRecord = { ...academicDto };
    student.academicHistory.push(academicRecord);
    await this.studentsRepository.save(student);
    return academicRecord;
  }

  async addMedicalRecord(
    studentId: string,
    medicalDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const medicalRecord = { id: crypto.randomUUID(), ...medicalDto };
    student.medicalHistory.push(medicalRecord);
    await this.studentsRepository.save(student);
    return medicalRecord;
  }

  async getAttendanceReport(
    studentId: string,
    period: 'daily' | 'weekly' | 'monthly',
  ): Promise<any> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const now = new Date();
    const filterAttendance = (days: number) => {
      const startDate = new Date(now.setDate(now.getDate() - days));
      return student.attendance.filter(
        (record) => new Date(record.date) >= startDate,
      );
    };

    let filteredAttendance;
    switch (period) {
      case 'daily':
        filteredAttendance = filterAttendance(1);
        break;
      case 'weekly':
        filteredAttendance = filterAttendance(7);
        break;
      case 'monthly':
        filteredAttendance = filterAttendance(30);
        break;
    }

    return {
      total: filteredAttendance.length,
      present: filteredAttendance.filter((r) => r.status === 'present').length,
      absent: filteredAttendance.filter((r) => r.status === 'absent').length,
      late: filteredAttendance.filter((r) => r.status === 'late').length,
      records: filteredAttendance,
    };
  }

  async getSubjectStrengthWeakness(studentId: string): Promise<any> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const subjectStats = student.academicHistory.reduce(
      (acc, record) => {
        acc[record.subject] = acc[record.subject] || { total: 0, count: 0 };
        acc[record.subject].total += record.grade;
        acc[record.subject].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      average: stats.total / stats.count,
      strength: stats.total / stats.count >= 75 ? 'Strength' : 'Weakness',
    }));
  }

  async getBehaviorTrends(studentId: string): Promise<any> {
    const student = await this.studentsRepository.findOneOrFail({
      where: { id: studentId },
    });
    const incidentsByMonth = student.incidents.reduce(
      (acc, incident) => {
        const month = new Date(incident.date).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });
        acc[month] = acc[month] || { count: 0, severity: 0 };
        acc[month].count += 1;
        acc[month].severity +=
          incident.severity === 'high'
            ? 3
            : incident.severity === 'medium'
              ? 2
              : 1;
        return acc;
      },
      {} as Record<string, { count: number; severity: number }>,
    );

    return Object.entries(incidentsByMonth).map(([month, data]) => ({
      month,
      incidentCount: data.count,
      averageSeverity: data.severity / data.count,
      prediction: data.count > 3 ? 'High risk' : 'Normal',
    }));
  }

  async getClassStats(className: string): Promise<any> {
    const students = await this.findByClass(className);
    const totalAttendance = students.reduce(
      (acc, s) => acc + s.attendance.length,
      0,
    );
    const presentAttendance = students.reduce(
      (acc, s) =>
        acc + s.attendance.filter((a) => a.status === 'present').length,
      0,
    );
    const academicStats = students
      .flatMap((s) => s.academicHistory)
      .reduce(
        (acc, record) => {
          acc[record.subject] = acc[record.subject] || { total: 0, count: 0 };
          acc[record.subject].total += record.grade;
          acc[record.subject].count += 1;
          return acc;
        },
        {} as Record<string, { total: number; count: number }>,
      );
    const topSubject = Object.entries(academicStats).reduce((a, b) =>
      a[1].total / a[1].count > b[1].total / b[1].count ? a : b,
    )[0];

    return {
      S1: students.filter((s) => s.enrolledClass === 'S1').length,
      S2: students.filter((s) => s.enrolledClass === 'S2').length,
      S3: students.filter((s) => s.enrolledClass === 'S3').length,
      S4: students.filter((s) => s.enrolledClass === 'S4').length,
      S5: students.filter((s) => s.enrolledClass === 'S5').length,
      S6: students.filter((s) => s.enrolledClass === 'S6').length,
      avgAttendance: totalAttendance
        ? (presentAttendance / totalAttendance) * 100
        : 0,
      topSubject,
      totalIncidents: students.reduce((acc, s) => acc + s.incidents.length, 0),
    };
  }

  async getStudentById(cardNumber: string) {
    return this.studentsRepository.findOne({where: {idNumber: cardNumber}})
  }
}
