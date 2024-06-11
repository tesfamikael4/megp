import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SolRegistration } from './sol-registration.entity';
import { EvaluationResponse } from 'src/utils/enums';
import { RFX } from './rfx.entity';
import { TeamMember } from './team-member.entity';

@Entity({ name: 'eval_assessments' })
@Unique([
  'teamMemberId',
  'rfxId',
  'isTeamAssessment',
  'solRegistrationId',
  'version',
])
export class EvalAssessment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssessment: boolean;

  @Column({ default: 0 })
  version: number;

  @Column({
    type: 'enum',
    enum: EvaluationResponse,
  })
  qualified: EvaluationResponse;

  @Column({ nullable: true })
  remark: string;

  @Column('uuid')
  teamMemberId: string;

  @ManyToOne(() => TeamMember, (team) => team.evaluationAssessments)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.evaluationAssessments)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evaluationAssessments,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
