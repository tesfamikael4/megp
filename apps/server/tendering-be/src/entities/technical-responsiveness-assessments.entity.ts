import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TechnicalPreliminaryAssessmentDetail } from './technical-preliminary-assessment-detail.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { TechnicalResponsivenessAssessmentDetail } from './technical-responsiveness-assessment-detail.entity';

@Entity({ name: 'technical_responsiveness_assessments' })
export class TechnicalResponsivenessAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetail) =>
      bidRegistrationDetail.technicalResponsivenessAssessments,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetail: BidRegistrationDetail;

  @OneToMany(
    () => TechnicalResponsivenessAssessmentDetail,
    (technicalResponsivenessAssessmentDetail) =>
      technicalResponsivenessAssessmentDetail.technicalResponsivenessAssessment,
  )
  @JoinColumn()
  technicalResponsivenessAssessmentDetail: TechnicalResponsivenessAssessmentDetail[];

  @Column('uuid')
  evaluatorId: string;

  @Column('uuid')
  itemId: string;

  // @ManyToOne(
  //   () => TeamMember,
  //   (teamMember) => teamMember.technicalPreliminaryAssessment,
  // )
  // @JoinColumn({ name: 'evaluatorId' })
  // evaluator: TeamMember;

  @Column()
  evaluatorName: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssessment: boolean;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ type: 'boolean' })
  submit: boolean;

  @Column({ default: 1 })
  version: number;
}
