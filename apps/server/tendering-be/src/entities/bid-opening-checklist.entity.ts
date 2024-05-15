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

@Entity({ name: 'bid_opening_checklists' })
export class BidOpeningChecklist extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.bidOpeningCheckLists)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

  @Column('uuid')
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.bidOpeningCheckLists)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column('uuid')
  spdOpeningChecklistId: string;

  @ManyToOne(
    () => SpdOpeningChecklist,
    (SpdOpeningChecklist) => SpdOpeningChecklist.bidOpeningCheckLists,
  )
  @JoinColumn({ name: 'spdOpeningChecklistId' })
  spdOpeningChecklistEntity: SpdOpeningChecklist;

  @Column('uuid')
  bidRegistrationDetailId: string;

  @ManyToOne(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.bidOpeningChecklist,
  )
  @JoinColumn({ name: 'bidRegistrationDetailId' })
  bidRegistrationDetails: BidRegistrationDetail;

  @Column('uuid')
  bidderId: string;

  @Column('uuid')
  bidderName: string;

  @Column('uuid')
  openerId: string;

  @Column()
  openerName: string;

  @Column({ default: false })
  isTeamLead: boolean;

  @Column()
  checked: boolean;

  @Column({ nullable: true })
  remark: string;

  // complete when one bidder's criteria are done
  @Column({ default: false })
  complete: boolean;

  //complete when all bidders criteria are done
  @Column({ default: false })
  submit: boolean;
}
