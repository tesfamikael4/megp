import { Audit } from 'megp-shared-be';
import { ETenderNoticeType } from 'src/utils/enums/tender-notice.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SavedNotice } from './saved-notice.entity';

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
  publishmentDate: Date;

  @Column('timestamptz')
  closingDate: Date;

  @OneToMany(() => SavedNotice, (bookmark) => bookmark.tenderNotice)
  savedNotices: SavedNotice[];
}
