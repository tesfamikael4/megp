import { OrgAudit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { SpdOpeningChecklist } from './spd-opening-checklist.entity';
import { Lot } from './lot.entity';
import { BidRegistration } from './bid-registration.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { BidOpeningChecklistAssessment } from './bid-opening-checklist-assessment.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';

@Entity({ name: 'bid_opening_checklist_assessment_details' })
export class BidOpeningChecklistAssessmentDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  bidOpeningChecklistAssessmentId: string;

  @ManyToOne(
    () => BidOpeningChecklistAssessment,
    (bidRegistrationChecklistAssessment) =>
      bidRegistrationChecklistAssessment.bidOpeningChecklistAssessmentDetails,
  )
  @JoinColumn({ name: 'bidOpeningChecklistAssessmentId' })
  bidOpeningChecklistAssessment: BidOpeningChecklistAssessment;

  @Column('uuid')
  spdOpeningChecklistId: string;

  @ManyToOne(
    () => SpdOpeningChecklist,
    (SpdOpeningChecklist) =>
      SpdOpeningChecklist.bidOpeningChecklistAssessmentDetails,
  )
  @JoinColumn({ name: 'spdOpeningChecklistId' })
  spdOpeningChecklistEntity: SpdOpeningChecklist;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ nullable: true })
  remark: string;
}
