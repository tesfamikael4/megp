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
import { SecurityQuestion } from './security-question.entity';

@Entity({ name: 'users_new' })
export class User extends Audit {
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

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'DRAFT' })
  status: string;

  @OneToMany(
    () => SecurityQuestion,
    (securityQuestion) => securityQuestion.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  securityQuestions: SecurityQuestion[];
}
