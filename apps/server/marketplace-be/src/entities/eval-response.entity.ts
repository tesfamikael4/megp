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
@Unique(['teamMemberId', 'rfxId', 'isTeamAssesment', 'openedResponseId'])
export class EvalResponse extends Audit {
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
  openedResponseId: string;

  @Column('uuid')
  teamMemberId: string;

  @Column('uuid')
  rfxId: string;

  @Column('uuid')
  rfxDocumentaryEvidenceId: string;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(() => RfxDocumentaryEvidence, (evidence) => evidence.evalResponses)
  @JoinColumn({ name: 'rfxDocumentaryEvidenceId' })
  rfxDocumentaryEvidence: RfxDocumentaryEvidence;

  @ManyToOne(() => RFX, (rfx) => rfx.evalResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(() => TeamMember, (team) => team.responseEvaluations)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @ManyToOne(() => OpenedResponse, (registration) => registration.evalResponses)
  @JoinColumn({ name: 'openedResponseId' })
  openedResponse: OpenedResponse;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evalResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
