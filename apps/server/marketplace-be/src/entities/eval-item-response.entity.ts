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
@Unique(['teamMemberId', 'rfxProductInvitaitonId', 'isTeamAssesment'])
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
  openedItemResponseId: string;

  @Column('uuid')
  rfxProductInvitaitonId: string;

  @Column('uuid')
  teamMemberId: string;

  @Column('uuid')
  rfxItemId: string;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(() => TeamMember, (team) => team.itemResponseEvaluations)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember: TeamMember;

  @ManyToOne(() => OpenedItemResponse, (response) => response.evalItemResponses)
  @JoinColumn({ name: 'openedItemResponseId' })
  openedItemResponse: OpenedItemResponse;

  @ManyToOne(
    () => RfxProductInvitation,
    (invitation) => invitation.evalItemResponses,
  )
  @JoinColumn({ name: 'rfxProductInvitaitonId' })
  rfxProductInvitation: RfxProductInvitation;

  @ManyToOne(() => RFXItem, (invitation) => invitation.evalItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @ManyToOne(
    () => SolRegistration,
    (invitation) => invitation.evalItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
