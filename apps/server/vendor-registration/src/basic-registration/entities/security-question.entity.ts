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
} from "typeorm";

import { BasicRegistration } from './basic-registration.entity';


@Entity({ name: "security_questions" })
export class SecurityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  basicRegistrationId: string;

  @ManyToOne(() => BasicRegistration, (basicRegistration) => basicRegistration.securityQuestions)
  @JoinColumn({ name: 'basicRegistrationId' })
  public basicRegistration: BasicRegistration;

}