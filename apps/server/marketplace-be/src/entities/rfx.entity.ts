import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { RfxProcurementMechanism } from './rfx-procurement-mechanism.entity';
import { RfxProcurementTechnicalTeam } from './rfx-procurement-technical-team.entity';
import { RfxBidProcedure } from './rfx-bid-procedure.entity';
import { RfxBidQualification } from './rfx-bid-qualification.entity';
import { RfxBidContractCondition } from './rfx-bid-contract-condition.entity';
import { ERfxStatus } from 'src/utils/enums';
import { RfxDocumentaryEvidence } from './rfx-documentary-evidence.entity';
import { RfxNote } from './rfx-note.entity';
import { RfxRevisionApproval } from './rfx-revision-approval.entity';
import { SolRegistration } from './sol-registration.entity';
import { SolRound } from './sol-round.entity';
import { SolResponse } from './sol-response.entity';
import { SolBookmark } from './sol-bookmark.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  budgetAmount: number;

  @Column()
  budgetAmountCurrency: string;

  @Column()
  budgetCode: string;

  @Column()
  prId: string;

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
  reviewDeadline: string;

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

  @OneToMany(
    () => RfxBidQualification,
    (rfxBidQualification) => rfxBidQualification.rfx,
  )
  rfxBidQualifications: RfxBidQualification[];

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

  @OneToMany(() => RfxNote, (rfxNote) => rfxNote.rfx)
  notes: RfxNote[];

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
  responses: SolResponse[];
}
