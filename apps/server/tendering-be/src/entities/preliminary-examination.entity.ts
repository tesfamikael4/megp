import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'preliminary_examinations' })
export class PreliminaryExamination extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.preliminaryExaminations)
  @JoinColumn()
  lot: Lot;

  @Column()
  criteria: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  itbDescription: string;

  @Column()
  itbReference: string;

  @Column()
  isRequired: boolean;

  @Column()
  requirementCondition: string;

  @Column()
  type: string;

  @Column()
  formLink: string;

  // relation?
  @Column()
  spdPreliminaryExaminationId: string;
}
