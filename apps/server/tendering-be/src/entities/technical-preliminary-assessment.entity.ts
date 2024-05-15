import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { TechnicalPreliminaryAssessmentDetail } from './technical-preliminary-assessment-detail.entity';

@Unique(['bidRegistrationDetailId', 'isTeamAssessment', 'evaluatorId'])
@Entity({ name: 'technical_preliminary_assessments' })
export class TechnicalPreliminaryAssessment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetail) =>
      bidRegistrationDetail.technicalPreliminaryAssessment,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetail: BidRegistrationDetail;

  @OneToMany(
    () => TechnicalPreliminaryAssessmentDetail,
    (technicalPreliminaryAssessmentDetail) =>
      technicalPreliminaryAssessmentDetail.technicalPreliminaryAssessment,
  )
  @JoinColumn()
  technicalPreliminaryAssessmentDetail: TechnicalPreliminaryAssessmentDetail[];

  @Column('uuid')
  evaluatorId: string;

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
