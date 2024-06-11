import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EvaluationResponse } from 'src/utils/enums';
import { RFX } from './rfx.entity';
import { TeamMember } from './team-member.entity';
import { RfxDocumentaryEvidence } from './rfx-documentary-evidence.entity';
import { OpenedResponse } from './opened-response.entity';
import { SolRegistration } from './sol-registration.entity';

@Entity({ name: 'eval_responses' })
@Unique([
  'teamMemberId',
  'rfxId',
  'isTeamAssessment',
  'openedResponseId',
  'version',
])
export class EvalResponse extends Audit {
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
  rfxDocumentaryEvidenceId: string;

  @ManyToOne(() => RfxDocumentaryEvidence, (evidence) => evidence.evalResponses)
  @JoinColumn({ name: 'rfxDocumentaryEvidenceId' })
  rfxDocumentaryEvidence: RfxDocumentaryEvidence;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.evalResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column('uuid')
  teamMemberId: string;

  @ManyToOne(() => TeamMember, (team) => team.responseEvaluations)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @Column('uuid')
  openedResponseId: string;

  @ManyToOne(() => OpenedResponse, (registration) => registration.evalResponses)
  @JoinColumn({ name: 'openedResponseId' })
  openedResponse: OpenedResponse;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evalResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
