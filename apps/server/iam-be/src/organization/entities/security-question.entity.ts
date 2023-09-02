import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Employee } from './employee.entity';

@Entity({ name: 'security_questions' })
export class SecurityQuestion extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.securityQuestions)
  @JoinColumn({ name: 'employeeId' })
  public employee: Employee;
}
