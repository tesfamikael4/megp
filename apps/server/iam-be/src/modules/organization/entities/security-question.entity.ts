import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { User } from './user.entity';
@Entity({ name: 'security_questions' })
export class SecurityQuestion extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.securityQuestions)
  @JoinColumn({ name: 'userId' })
  public user: User;
}
