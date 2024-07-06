import { Audit } from 'megp-shared-be';
import { ETenderNoticeType } from 'src/utils/enums/tender-notice.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SavedNotice } from './saved-notice.entity';
import { TenderProcurementMechanism } from './tender-procurement-mechanism.entity';

@Entity({ name: 'tender_notices' })
export class TenderNotice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ETenderNoticeType,
  })
  objectType: ETenderNoticeType;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  procurementCategory: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column()
  budgetCode: string;

  @Column()
  prId: string;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  organizationId: string;

  @Column()
  organizationName: string;

  @Column('timestamptz')
  publishedDate: Date;

  @Column('timestamptz')
  closingDate: Date;

  @OneToMany(() => SavedNotice, (bookmark) => bookmark.tenderNotice, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  savedNotices: SavedNotice[];

  @OneToOne(
    () => TenderProcurementMechanism,
    (bookmark) => bookmark.tenderNotice,
    { cascade: true, onDelete: 'CASCADE' },
  )
  tenderProcurementMechanism: TenderProcurementMechanism;
}
