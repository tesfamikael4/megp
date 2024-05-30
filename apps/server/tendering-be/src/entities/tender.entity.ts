import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementTechnicalTeam } from './procurement-technical-team.entity';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { Lot } from './lot.entity';
import { BdsGeneral } from './bds-general.entity';
import { BdsSubmission } from './bds-submission.entity';
import { BdsEvaluation } from './bds-evaluation.entity';
import { BdsPreparation } from './bds-preparation.entity';
import { BdsAward } from './bds-award.entity';
import { TenderSpd } from './tender-spd.entity';
import { SccContractDeliverable } from './scc-contract-deliverable.entity';
import { SccGeneralProvision } from './scc-general-provision.entity';
import { SccGuarantee } from './scc-guarantee.entity';
import { SccLiability } from './scc-liability.entity';
import { SccPaymentSchedule } from './scc-payment-schedule.entity';
import { SccPaymentTerm } from './scc-payment-term.entity';
import { TenderParticipationFee } from './tender-participation-fee.entity';
import { TenderClassification } from './tender-classification.entity';
import { BidBookmark } from './bid-bookmark.entity';
import { BidRegistration } from './bid-registration.entity';
import { TenderPersonal } from './tender-personal.entity';
import { Opening } from './opening.entity';
import { BidOpeningChecklist } from './bid-opening-checklist.entity';
import { Team } from './team.entity';
import { Note } from './note.entity';
import { TenderMilestone } from './tender-milestone.entity';
import { RevisionApproval } from './revision-approval.entity';
import { TenderStatusEnum } from 'src/shared/enums/tender-status.enum';

@Entity({ name: 'tenders' })
export class Tender extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  procurementCategory: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column({ type: 'numeric', default: 0 })
  budgetAmount: number;

  @Column()
  budgetAmountCurrency: string;

  @Column()
  budgetCode: string;

  @Column()
  prId: string;

  @Column({ type: 'numeric', default: 0 })
  marketEstimate: number;

  @Column()
  marketEstimateCurrency: string;

  @Column({
    type: 'enum',
    enum: TenderStatusEnum,
    default: TenderStatusEnum.DRAFT,
  })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  organizationId: string;

  @Column()
  organizationName: string;

  @Column({ type: 'jsonb', nullable: true })
  tenderDocument: any;

  @Column({ type: 'jsonb', nullable: true })
  tenderInvitation: any;

  @OneToMany(
    () => ProcurementTechnicalTeam,
    (procurementTechnicalTeam) => procurementTechnicalTeam.tender,
    {
      cascade: true,
    },
  )
  procurementTechnicalTeams: ProcurementTechnicalTeam[];

  @OneToMany(() => Lot, (lot) => lot.tender, { cascade: true })
  lots: Lot[];

  @OneToOne(() => TenderSpd, (spd) => spd.tender)
  spd: TenderSpd;

  @OneToOne(() => BdsGeneral, (general) => general.tender)
  bdsGeneral: BdsGeneral;

  @OneToOne(() => BdsPreparation, (preparation) => preparation.tender)
  bdsPreparation: BdsPreparation;

  @OneToOne(() => BdsSubmission, (submissions) => submissions.tender)
  bdsSubmission: BdsSubmission;

  @OneToOne(() => BdsEvaluation, (evaluations) => evaluations.tender)
  bdsEvaluation: BdsEvaluation;

  @OneToOne(() => BdsAward, (awards) => awards.tender)
  bdsAward: BdsAward;

  @OneToOne(
    () => ProcurementMechanism,
    (procurementMechanism) => procurementMechanism.tender,
  )
  procurementMechanism: ProcurementMechanism;

  @OneToMany(
    () => SccContractDeliverable,
    (sccContractDeliverable) => sccContractDeliverable.tender,
  )
  sccContractDeliverables: SccContractDeliverable[];

  @OneToMany(
    () => SccGeneralProvision,
    (sccGeneralProvision) => sccGeneralProvision.tender,
  )
  sccGeneralProvisions: SccGeneralProvision[];

  @OneToMany(() => SccGuarantee, (sccGuarantee) => sccGuarantee.tender)
  sccGuarantees: SccGuarantee[];

  @OneToMany(() => SccLiability, (sccLiability) => sccLiability.tender)
  sccLiabilities: SccLiability[];

  @OneToMany(
    () => SccPaymentSchedule,
    (sccPaymentSchedule) => sccPaymentSchedule.tender,
  )
  sccPaymentSchedules: SccPaymentSchedule[];

  @OneToMany(() => SccPaymentTerm, (sccPaymentTerm) => sccPaymentTerm.tender)
  sccPaymentTerms: SccPaymentTerm[];

  @OneToOne(
    () => TenderParticipationFee,
    (tenderParticipationFee) => tenderParticipationFee.tender,
  )
  tenderParticipationFee: TenderParticipationFee;

  @OneToMany(
    () => TenderClassification,
    (tenderClassification) => tenderClassification.tender,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  tenderClassifications: TenderClassification[];

  @OneToMany(() => TenderPersonal, (tenderPersonal) => tenderPersonal.tender, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tenderPersonals: TenderPersonal[];

  @OneToMany(() => BidBookmark, (bidBookmark) => bidBookmark.tender, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bidBookmarks: BidBookmark[];

  @OneToMany(
    () => BidRegistration,
    (bidRegistrations) => bidRegistrations.tender,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  bidRegistrations: BidRegistration[];

  @OneToOne(() => Opening, (opening) => opening.tender)
  opening: Opening;

  @OneToMany(
    () => RevisionApproval,
    (revisionApproval) => revisionApproval.tender,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  revisionApprovals: RevisionApproval[];

  @OneToMany(
    () => BidOpeningChecklist,
    (bidOpeningCheckList) => bidOpeningCheckList.tender,
  )
  bidOpeningCheckLists: BidOpeningChecklist[];

  @OneToMany(() => Team, (team) => team.tender)
  teams: Team[];

  @OneToMany(
    () => TenderMilestone,
    (tenderTenderMilestone) => tenderTenderMilestone.tender,
    { cascade: true },
  )
  tenderMilestones: TenderMilestone[];

  @OneToMany(() => Note, (note) => note.tender)
  notes: Note[];
}
