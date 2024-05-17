import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';

@Entity({ name: 'bidders_comparisons' })
export class BiddersComparison extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.biddersComparisons,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetail: BidRegistrationDetail;

  @Column({
    type: 'uuid',
    default: '00000000-0000-0000-0000-000000000000',
  })
  itemId: string;

  @Column({
    type: 'enum',
    enum: TenderMilestoneEnum,
  })
  milestoneNum: number;

  @Column({
    type: 'enum',
    enum: Object.values(TenderMilestoneEnum),
  })
  milestoneTxt: string;

  @Column({
    type: 'enum',
    enum: BidderStatusEnum,
  })
  bidderStatus: number;

  @Column({
    type: 'enum',
    enum: Object.values(BidderStatusEnum),
  })
  bidderStatusTxt: string;

  @Column({ default: 0 })
  technicalPoints: number;

  @Column({ default: 0 })
  financialPoints: number;

  @Column({ default: true })
  isCurrent: boolean;

  @Column()
  passFail: boolean;

  @Column({ default: 1 })
  version: number;
}
