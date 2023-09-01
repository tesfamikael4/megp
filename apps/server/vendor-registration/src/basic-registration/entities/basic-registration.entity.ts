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

import { SecurityQuestion } from './security-question.entity';


@Entity({ name: "basic_registrations" })
export class BasicRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  superTokenUserId: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  alternativeEmail: string;

  @Column()
  name: string;

  @Column()
  formOfBusiness: string;

  @Column()
  companyOrigin: string;

  @Column({ nullable: true })
  district: string;

  @Column()
  country: string;

  @OneToMany(
    () => SecurityQuestion,
    (securityQuestion) => securityQuestion.basicRegistration,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  securityQuestions: SecurityQuestion[];

}