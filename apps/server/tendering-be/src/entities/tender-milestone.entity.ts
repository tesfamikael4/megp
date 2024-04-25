import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Tender } from './tender.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';

@Unique(['lotId', 'isCurrent'])
@Entity({ name: 'tender_milestones' })
export class TenderMilestone extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.tenderMilestones)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column('uuid')
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.tenderMilestones)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

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

  @Column({ type: 'boolean' })
  isCurrent: boolean;
}
