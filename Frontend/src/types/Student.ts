export interface Student {
  id: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber: string;
  enrolledClass: string;
  parentName: string;
  parentPhoneNumber: string;
  admissionDate: string;
  medicalHistory: MedicalRecord[];
  academicHistory: AcademicRecord[];
  attendance: AttendanceRecord[];
  incidents: Incident[];
  points: number;
}

export interface MedicalRecord {
  id: string;
  condition: string;
  date: string;
  notes: string;
  emergencyLevel: "low" | "medium" | "high";
}

export interface AcademicRecord {
  subject: string;
  grade: number;
  semester: string;
  year: number;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

export interface Incident {
  id: string;
  type: "behavioral" | "academic" | "safety";
  description: string;
  severity: "low" | "medium" | "high";
  date: string;
  status: "pending" | "resolved" | "in-progress";
}
