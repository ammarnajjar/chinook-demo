import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Employee' })
export class Employee {
  @PrimaryColumn({ name: 'EmployeeId' })
  EmployeeId: number;

  @Column({ name: 'LastName' })
  LastName: string;

  @Column({ name: 'FirstName' })
  FirstName: string;

  @Column({ name: 'Title', nullable: true })
  Title?: string;

  @Column({ name: 'ReportsTo', nullable: true })
  ReportsTo?: number;

  @Column({ name: 'BirthDate', type: 'datetime', nullable: true })
  BirthDate?: Date;

  @Column({ name: 'HireDate', type: 'datetime', nullable: true })
  HireDate?: Date;

  @Column({ name: 'Address', nullable: true })
  Address?: string;

  @Column({ name: 'City', nullable: true })
  City?: string;

  @Column({ name: 'State', nullable: true })
  State?: string;

  @Column({ name: 'Country', nullable: true })
  Country?: string;

  @Column({ name: 'PostalCode', nullable: true })
  PostalCode?: string;

  @Column({ name: 'Phone', nullable: true })
  Phone?: string;

  @Column({ name: 'Fax', nullable: true })
  Fax?: string;

  @Column({ name: 'Email', nullable: true })
  Email?: string;
}
