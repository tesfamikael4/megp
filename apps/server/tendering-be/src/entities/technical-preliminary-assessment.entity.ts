import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { SpdPreliminaryEvaluation } from './spd-preliminary-evaluation.entity';
import { TeamMember } from './team-member.entity';

@Entity({ name: 'technical_preliminary_assessments' })
export class TechnicalPreliminaryAssessment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @OneToOne(
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

  @ManyToOne(
    () => TeamMember,
    (teamMember) => teamMember.technicalPreliminaryAssessment,
  )
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: TeamMember;

  @Column({ type: 'boolean' })
  isTeamAssessment: boolean;

  @Column()
  status: string;

  @Column({ type: 'boolean' })
  submit: boolean;

  @Column({ default: 1 })
  version: number;
}
