import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EvaluationResponse } from 'src/utils/enums';
import {
  RFXItem,
  RfxProcurementTechnicalTeam,
  RfxProductInvitation,
  SolRegistration,
} from '.';

@Entity({ name: 'eval_item_responses' })
@Unique(['evaluatorId', 'rfxProductInvitaitonId'])
export class EvalItemResponse extends Audit {
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
  solRegistrationId: string;

  @Column('uuid')
  rfxProductInvitaitonId: string;

  @Column('uuid')
  evaluatorId: string;

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(
    () => RfxProcurementTechnicalTeam,
    (team) => team.evalItemResponses,
  )
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: RfxProcurementTechnicalTeam;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evalItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @ManyToOne(
    () => RfxProductInvitation,
    (invitation) => invitation.evalItemResponses,
  )
  @JoinColumn({ name: 'rfxProductInvitaitonId' })
  rfxProductInvitation: RfxProductInvitation;

  @ManyToOne(() => RFXItem, (invitation) => invitation.evalItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
