import { OrgAudit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tender } from './tender.entity';
import { SpdOpeningChecklist } from './spd-opening-checklist.entity';
import { Lot } from './lot.entity';
// import { BidRegistration } from './bid-registration.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { BidOpeningChecklistAssessmentDetail } from './bid-opening-checklist-assessment-detail.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';

@Entity({ name: 'bid_opening_checklist_assessments' })
export class BidOpeningChecklistAssessment extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.bidOpeningChecklistAssessments)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

  @Column('uuid')
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.bidOpeningChecklistAssessments)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column('uuid')
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) =>
      bidRegistrationDetails.bidOpeningChecklistAssessmentDetails,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetails: BidRegistrationDetail;

  @OneToMany(
    () => BidOpeningChecklistAssessmentDetail,
    (bidOpeningChecklistAssessmentDetail) =>
      bidOpeningChecklistAssessmentDetail.bidOpeningChecklistAssessment,
  )
  bidOpeningChecklistAssessmentDetails: BidOpeningChecklistAssessmentDetail[];

  @Column('uuid')
  bidderId: string;

  @Column()
  bidderName: string;

  @Column('uuid')
  openerId: string;

  @Column()
  openerName: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssessment: boolean;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  //complete when all bidders criteria are done
  @Column({ default: false })
  submit: boolean;
}
