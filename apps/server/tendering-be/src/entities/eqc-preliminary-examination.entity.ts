import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot, TechnicalPreliminaryAssessmentDetail } from '.';
import { SpdBidForm } from './spd-bid-form.entity';

@Entity({ name: 'eqc_preliminary_examinations' })
export class EqcPreliminaryExamination extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.eqcPreliminaryExaminations)
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
  bidFormId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.eqcPreliminaryExaminations)
  @JoinColumn({ name: 'bidFormId' })
  bidForm: SpdBidForm;

  // relation?
  @Column({ type: 'uuid', nullable: true })
  spdEqcPreliminaryExaminationId: string;

  @OneToMany(
    () => TechnicalPreliminaryAssessmentDetail,
    (technicalPreliminaryAssessment) =>
      technicalPreliminaryAssessment.eqcPreliminaryExamination,
  )
  @JoinColumn()
  technicalPreliminaryAssessments: TechnicalPreliminaryAssessmentDetail[];
}
