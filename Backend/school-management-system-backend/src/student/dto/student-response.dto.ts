import { Expose } from 'class-transformer';

export class StudentDto {
  @Expose()
  id: number;

  @Expose()
  idNumber: string;

  @Expose()
  name: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}
