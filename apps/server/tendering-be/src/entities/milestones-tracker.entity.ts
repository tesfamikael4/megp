import { OrgAudit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Lot } from './lot.entity';

@Entity({ name: 'milestones_trackers' })
export class MilestonesTracker extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lotId: string;

  @OneToOne(() => Lot, (lot) => lot.milestonesTracker)
  lot: Lot;

  @Column('text')
  milestoneType: string;

  // @Column('timestamp')
  // plannedStartDate: Date;

  @Column('timestamp', { nullable: true })
  actualStartDate: Date;

  // @Column('timestamp')
  // plannedEndDate: Date;

  @Column('timestamp', { nullable: true })
  actualEndDate: Date;

  @Column('timestamp')
  timeStamp: Date;
}
