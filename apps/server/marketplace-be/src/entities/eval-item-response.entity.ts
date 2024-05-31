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
import {
  OpenedItemResponse,
  RFXItem,
  RfxProductInvitation,
  SolRegistration,
} from '.';
import { TeamMember } from './team-member.entity';

@Entity({ name: 'eval_item_responses' })
@Unique(['teamMemberId', 'rfxProductInvitaitonId', 'isTeamAssessment'])
export class EvalItemResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssessment: boolean;

  @Column({
    type: 'enum',
    enum: EvaluationResponse,
  })
  qualified: EvaluationResponse;

  @Column({ nullable: true })
  remark: string;

  @Column('uuid')
  teamMemberId: string;

  @ManyToOne(() => TeamMember, (team) => team.itemResponseEvaluations)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @Column('uuid')
  openedItemResponseId: string;

  @ManyToOne(() => OpenedItemResponse, (response) => response.evalItemResponses)
  @JoinColumn({ name: 'openedItemResponseId' })
  openedItemResponse: OpenedItemResponse;

  @Column('uuid')
  rfxProductInvitaitonId: string;

  @ManyToOne(
    () => RfxProductInvitation,
    (invitation) => invitation.evalItemResponses,
  )
  @JoinColumn({ name: 'rfxProductInvitaitonId' })
  rfxProductInvitation: RfxProductInvitation;

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (invitation) => invitation.evalItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (invitation) => invitation.evalItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
