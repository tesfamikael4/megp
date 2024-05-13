import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';

@Entity({ name: 'bidders-comparisons' })
export class BiddersComparison extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.biddersComparison,
  )
  @JoinColumn({ name: 'bidRegistrationId' })
  bidRegistrationDetails: BidRegistrationDetail[];

  @Column()
  itemId: string;

  @Column({
    type: 'enum',
    enum: TenderMilestoneEnum,
  })
  milestone: string;

  @Column()
  bidderStatus: string;

  @Column()
  technicalPoints: string;

  @Column()
  financialPoints: string;

  @Column()
  isCurrent: boolean;

  @Column()
  passFail: string;

  @Column()
  version: string;
}
