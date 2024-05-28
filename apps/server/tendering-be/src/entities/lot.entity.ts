import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { EqcPreliminaryExamination } from './eqc-preliminary-examination.entity';
import { EqcQualification } from './eqc-qualification.entity';
import { EqcTechnicalScoring } from './eqc-technical-scoring.entity';
import { EqcPreferenceMargin } from './eqc-preference-margin.entity';
import { EqcDueDiligence } from './eqc-due-diligence.entity';
import { Item } from './tender-item.entity';
import { BdsBidSecurity } from './bds-bid-security.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { BidOpeningChecklist } from './bid-opening-checklist.entity';
import { Team } from './team.entity';
import { MilestonesTracker } from './milestones-tracker.entity';
import { BidGuarantee } from './bid-guarantee.entity';
import { EqcDocumentaryEvidence } from './eqc-documentary-evidence.entity';
import { TenderMilestone } from './tender-milestone.entity';
import { PriceAdjustingFactor } from './price-adjusting-factor.entity';
import { ExchangeRate } from './exchange-rate.entity';
import { BidPriceEvaluation } from './bid-price-evaluation.entity';
import { LotStatusEnum } from 'src/shared/enums/tender-status.enum';

@Entity({ name: 'lots' })
export class Lot extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.lots)
  @JoinColumn()
  tender: Tender;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: LotStatusEnum, default: LotStatusEnum.DRAFT })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @OneToMany(() => Item, (item) => item.lot)
  items: Item[];

  @OneToMany(
    () => EqcPreliminaryExamination,
    (EqcPreliminaryExamination) => EqcPreliminaryExamination.lot,
  )
  eqcPreliminaryExaminations: EqcPreliminaryExamination[];

  @OneToMany(() => EqcQualification, (eqcQualification) => eqcQualification.lot)
  eqcQualifications: EqcQualification[];

  @OneToMany(
    () => EqcTechnicalScoring,
    (eqcTechnicalScoring) => eqcTechnicalScoring.lot,
  )
  eqcTechnicalScorings: EqcTechnicalScoring[];

  @OneToMany(
    () => EqcPreferenceMargin,
    (eqcQreferenceMargin) => eqcQreferenceMargin.lot,
  )
  eqcPreferenceMargins: EqcPreferenceMargin[];

  @OneToMany(() => EqcDueDiligence, (eqcDueDelegence) => eqcDueDelegence.lot)
  eqcDueDiligences: EqcDueDiligence[];

  @OneToMany(
    () => EqcDocumentaryEvidence,
    (eqcDocumentaryEvidence) => eqcDocumentaryEvidence.lot,
  )
  eqcDocumentaryEvidences: EqcDocumentaryEvidence[];

  @OneToOne(() => BdsBidSecurity, (bdsBidSecurity) => bdsBidSecurity.lot)
  bdsBidSecurity: BdsBidSecurity;

  @OneToMany(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.lot,
  )
  bidRegistrationDetails: BidRegistrationDetail[];

  @OneToMany(
    () => BidOpeningChecklist,
    (bidOpeningCheckList) => bidOpeningCheckList.lot,
  )
  bidOpeningCheckLists: BidOpeningChecklist[];

  @OneToMany(() => Team, (team) => team.lot)
  teams: Team[];

  @OneToOne(
    () => MilestonesTracker,
    (milestonesTracker) => milestonesTracker.lot,
  )
  milestonesTracker: MilestonesTracker;

  @OneToMany(() => BidGuarantee, (bidGuarantee) => bidGuarantee.lot)
  bidGuarantee: BidGuarantee[];

  @OneToMany(
    () => TenderMilestone,
    (tenderTenderMilestone) => tenderTenderMilestone.lot,
  )
  tenderMilestones: TenderMilestone[];

  @OneToMany(
    () => PriceAdjustingFactor,
    (priceAdjustingFactor) => priceAdjustingFactor.lot,
  )
  priceAdjustingFactors: PriceAdjustingFactor[];

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.lot)
  exchangeRates: ExchangeRate[];

  @OneToMany(
    () => BidPriceEvaluation,
    (bidPriceEvaluation) => bidPriceEvaluation.lot,
  )
  bidPriceEvaluations: BidPriceEvaluation[];
}
