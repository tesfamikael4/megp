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
import { TeamMember } from './team-member.entity';

@Unique(['bidRegistrationDetailId', 'spdPreliminaryEvaluationId'])
@Entity({ name: 'technical_preliminary_assessments' })
export class TechnicalPreliminaryAssessment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (BidRegistrationDetail) =>
      BidRegistrationDetail.technicalPreliminaryAssessment,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetail: BidRegistrationDetail;

  @Column('uuid')
  spdPreliminaryEvaluationId: string;

  @ManyToOne(
    () => SpdPreliminaryEvaluation,
    (spdPreliminaryEvaluation) =>
      spdPreliminaryEvaluation.technicalPreliminaryAssessment,
  )
  @JoinColumn({ name: 'spdPreliminaryEvaluationId' })
  SpdPreliminaryEvaluation: SpdPreliminaryEvaluation;

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

  @Column({ type: 'boolean' })
  submit: boolean;

  @Column({ default: 1 })
  version: number;

  @Column()
  checked: boolean;

  @Column({ nullable: true })
  remark: string;
}
