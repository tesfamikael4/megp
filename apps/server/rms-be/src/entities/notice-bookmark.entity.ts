import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ETenderNoticeType } from 'src/utils/enums/tender-notice.enum';
import { TenderNotice } from './tender-notice.entity';

@Entity({ name: 'notice_bookmarks' })
export class NoticeBookmark extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ETenderNoticeType,
  })
  objectType: ETenderNoticeType;

  @Column()
  userId: string;

  @Column('uuid')
  noticeId: string;

  @ManyToOne(() => TenderNotice, (notice) => notice.noticeBookmarks)
  @JoinColumn({ name: 'noticeId' })
  tenderNotice: TenderNotice;
}
