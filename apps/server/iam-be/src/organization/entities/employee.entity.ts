import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Organization } from './organization.entity';
import { SecurityQuestion } from './security-question.entity';

@Entity({ name: 'employees' })
export class Employee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  superTokenUserId: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.employees)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToMany(
    () => SecurityQuestion,
    (securityQuestion) => securityQuestion.employee,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  securityQuestions: SecurityQuestion[];
}
