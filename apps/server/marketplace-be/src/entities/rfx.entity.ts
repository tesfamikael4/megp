import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  AwardNote,
  EvalAssessment,
  RfxDocumentaryEvidence,
  EvalResponse,
  RFXItem,
  RfxBidContractCondition,
  RfxBidProcedure,
  RfxContractTerm,
  RfxProcurementMechanism,
  RfxProcurementTechnicalTeam,
  RfxRevisionApproval,
  SolBookmark,
  SolRegistration,
  SolResponse,
  SolRound,
  TeamMember,
} from '.';
import { ERfxStatus } from 'src/utils/enums';

@Entity({ name: 'rfxes' })
export class RFX extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  procurementCategory: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column({ nullable: true })
  description: string;

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

  @Column({ default: 0 })
  version: number;

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

  @OneToMany(() => RfxContractTerm, (terms) => terms.rfx)
  rfxContractTerms: RfxContractTerm[];

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

  @OneToOne(() => AwardNote, (award) => award.rfx)
  awardNote: AwardNote;
}
