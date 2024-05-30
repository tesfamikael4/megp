import { Audit } from 'megp-shared-be';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { RfxProcurementMechanism } from './rfx-procurement-mechanism.entity';
import { RfxProcurementTechnicalTeam } from './rfx-procurement-technical-team.entity';
import { RfxBidProcedure } from './rfx-bid-procedure.entity';
import { RfxBidContractCondition } from './rfx-bid-contract-condition.entity';
import { ERfxStatus } from 'src/utils/enums';
import { RfxDocumentaryEvidence } from './rfx-documentary-evidence.entity';
import { RfxRevisionApproval } from './rfx-revision-approval.entity';
import { SolRegistration } from './sol-registration.entity';
import { SolRound } from './sol-round.entity';
import { SolResponse } from './sol-response.entity';
import { SolBookmark } from './sol-bookmark.entity';
import { EvalResponse } from './eval-response.entity';
import { TeamMember } from './team-member.entity';
import { EvalAssessment } from './eval-assessment.entity';

@Entity({ name: 'rfxs' })
export class RFX extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  procurementCategory: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  budgetAmount: number;

  @Column()
  budgetAmountCurrency: string;

  @Column()
  budgetCode: string;

  @Column()
  prId: string;

  @Column({ default: false, type: 'boolean' })
  isOpen: boolean;

  @Column({
    type: 'enum',
    enum: ERfxStatus,
    default: ERfxStatus.DRAFT,
  })
  status: ERfxStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  organizationId: string;

  @Column()
  organizationName: string;

  @Column({ nullable: true })
  parentId: string;

  @OneToOne(() => RFX, (rfx) => rfx.child)
  parent: RFX;

  @OneToOne(() => RFX, (rfx) => rfx.parent)
  @JoinColumn({ name: 'parentId' })
  child: RFX;

  @OneToMany(() => RFXItem, (RFXItem) => RFXItem.rfx)
  items: RFXItem[];

  @OneToOne(() => RfxBidProcedure, (RfxBidProcedure) => RfxBidProcedure.rfx)
  rfxBidProcedure: RfxBidProcedure;

  @OneToOne(
    () => RfxProcurementMechanism,
    (procurementMechanism) => procurementMechanism.rfx,
  )
  rfxProcurementMechanism: RfxProcurementMechanism;

  @OneToMany(
    () => RfxProcurementTechnicalTeam,
    (rfxProcurementTechnicalTeam) => rfxProcurementTechnicalTeam.rfx,
  )
  rfxProcurementTechnicalTeams: RfxProcurementTechnicalTeam[];

  @OneToOne(
    () => RfxBidContractCondition,
    (rfxBidContractCondition) => rfxBidContractCondition.rfx,
  )
  rfxBidContractCondition: RfxBidContractCondition;

  @OneToMany(
    () => RfxDocumentaryEvidence,
    (rfxDocumentaryEvidences) => rfxDocumentaryEvidences.rfx,
  )
  rfxDocumentaryEvidences: RfxDocumentaryEvidence[];

  @OneToMany(
    () => RfxRevisionApproval,
    (revisionApproval) => revisionApproval.rfx,
  )
  revisionApprovals: RfxRevisionApproval[];

  @OneToMany(() => SolBookmark, (bookmark) => bookmark.rfx)
  solBookmarks: SolBookmark[];

  @OneToMany(() => SolRegistration, (bookmark) => bookmark.rfx)
  solRegistrations: SolRegistration[];

  @OneToMany(() => SolRound, (round) => round.rfx)
  solRounds: SolRound[];

  @OneToMany(() => SolResponse, (response) => response.rfx)
  solResponses: SolResponse[];

  @OneToMany(() => SolResponse, (response) => response.rfx)
  openedResponses: SolResponse[];

  @OneToMany(() => EvalResponse, (response) => response.rfx)
  evalResponses: EvalResponse[];

  @OneToMany(() => TeamMember, (response) => response.rfx)
  teamMembers: TeamMember[];

  @OneToMany(() => EvalAssessment, (response) => response.rfx)
  evaluationAssessments: EvalAssessment[];
}
