import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import {
  ESaveType,
  ETenderNoticeType,
} from 'src/utils/enums/tender-notice.enum';
import { TenderNotice } from './tender-notice.entity';

@Entity({ name: 'saved_notices' })
export class SavedNotice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ESaveType,
  })
  saveType: ESaveType;

  @Column()
  bidderId: string;

  @Column()
  bidderName: string;

  @Column('uuid')
  noticeId: string;

  @ManyToOne(() => TenderNotice, (notice) => notice.savedNotices)
  @JoinColumn({ name: 'noticeId' })
  tenderNotice: TenderNotice;
}
