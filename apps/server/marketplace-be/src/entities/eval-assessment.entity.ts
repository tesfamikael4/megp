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
@Unique(['teamMemberId', 'rfxId', 'isTeamAssesment'])
export class EvalAssessment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssesment: boolean;

  @Column({
    type: 'enum',
    enum: EvaluationResponse,
  })
  qualified: EvaluationResponse;

  @Column({ nullable: true })
  remark: string;

  @Column('uuid')
  teamMemberId: string;

  @Column('uuid')
  rfxId: string;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.evaluationAssessments)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(() => TeamMember, (team) => team.evaluationAssessments)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evaluationAssessments,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
