import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BidRegistration } from './bid-registration.entity';
import { Lot } from './lot.entity';
import { BidRegistrationDetailStatusEnum } from 'src/shared/enums';
import { BidResponseLot } from './bid-response-lot.entity';
import { BidResponseItem } from './bid-response-item.entity';
import { OpenedBidResponseItem } from './opened-bid-response-item.entity';
import { OpenedBidResponseLot } from './opened-bid-response-lot.entity';
import { TechnicalPreliminaryAssessment } from './technical-preliminary-assessment.entity';
import { BiddersComparison } from './bidders-comparison.entity';
import { BidOpeningChecklist } from './bid-opening-checklist.entity';
import { TechnicalQualificationAssessment } from './technical-qualification-assessments.entity';
import { TechnicalResponsivenessAssessment } from './technical-responsiveness-assessments.entity';

@Entity({ name: 'bid_registration_details' })
@Unique(['bidRegistrationId', 'lotId'])
export class BidRegistrationDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationId: string;

  @ManyToOne(() => BidRegistration, (tender) => tender.bidRegistrationDetails)
  @JoinColumn()
  bidRegistration: BidRegistration;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.bidRegistrationDetails)
  @JoinColumn()
  lot: Lot;

  @Column({
    type: 'enum',
    enum: BidRegistrationDetailStatusEnum,
    default: BidRegistrationDetailStatusEnum.NOT_SUBMITTED,
  })
  status: string;

  @Column({ type: 'simple-array', nullable: true })
  technicalItems: string[];

  @Column({ type: 'simple-array', nullable: true })
  financialItems: string[];

  @Column({ type: 'jsonb', nullable: true })
  document: any;

  @OneToMany(
    () => BidResponseLot,
    (bidResponseLots) => bidResponseLots.bidRegistrationDetail,
  )
  bidResponseLots: BidResponseLot[];

  @OneToMany(
    () => BidResponseItem,
    (bidResponseItems) => bidResponseItems.bidRegistrationDetail,
  )
  bidResponseItems: BidResponseItem[];

  @OneToMany(
    () => OpenedBidResponseItem,
    (bidResponseItems) => bidResponseItems.bidRegistrationDetail,
  )
  openedBidResponseItems: OpenedBidResponseItem[];

  @OneToMany(
    () => OpenedBidResponseLot,
    (bidResponseLots) => bidResponseLots.bidRegistrationDetail,
  )
  openedBidResponseLots: OpenedBidResponseLot[];

  @OneToMany(
    () => TechnicalPreliminaryAssessment,
    (technicalPreliminaryAssessment) =>
      technicalPreliminaryAssessment.bidRegistrationDetail,
  )
  technicalPreliminaryAssessments: TechnicalPreliminaryAssessment[];

  @OneToMany(
    () => TechnicalQualificationAssessment,
    (technicalQualificationAssessment) =>
      technicalQualificationAssessment.bidRegistrationDetail,
  )
  technicalQualificationAssessments: TechnicalQualificationAssessment[];

  @OneToMany(
    () => TechnicalResponsivenessAssessment,
    (technicalResponsivenessAssessment) =>
      technicalResponsivenessAssessment.bidRegistrationDetail,
  )
  technicalResponsivenessAssessments: TechnicalResponsivenessAssessment[];

  @OneToMany(
    () => BiddersComparison,
    (biddersComparison) => biddersComparison.bidRegistrationDetail,
  )
  biddersComparisons: BiddersComparison[];

  @OneToMany(
    () => BidOpeningChecklist,
    (bidOpeningChecklist) => bidOpeningChecklist.bidRegistrationDetails,
  )
  bidOpeningChecklists: BidOpeningChecklist[];
}
