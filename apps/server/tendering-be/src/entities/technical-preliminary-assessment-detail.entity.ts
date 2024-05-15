import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { SpdPreliminaryEvaluation } from './spd-preliminary-evaluation.entity';
import { TechnicalPreliminaryAssessment } from './technical-preliminary-assessment.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';

@Entity({ name: 'technical_preliminary_assessment_details' })
export class TechnicalPreliminaryAssessmentDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  technicalPreliminaryAssessmentId: string;

  @ManyToOne(
    () => TechnicalPreliminaryAssessment,
    (technicalPreliminaryAssessment) =>
      technicalPreliminaryAssessment.technicalPreliminaryAssessmentDetail,
    { cascade: true },
  )
  @JoinColumn({ name: 'technicalPreliminaryAssessmentId' })
  technicalPreliminaryAssessment: TechnicalPreliminaryAssessment;

  @Column('uuid')
  spdPreliminaryEvaluationId: string;

  @ManyToOne(
    () => SpdPreliminaryEvaluation,
    (spdPreliminaryEvaluation) =>
      spdPreliminaryEvaluation.technicalPreliminaryAssessment,
  )
  @JoinColumn({ name: 'spdPreliminaryEvaluationId' })
  SpdPreliminaryEvaluation: SpdPreliminaryEvaluation;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ nullable: true })
  remark: string;
}
