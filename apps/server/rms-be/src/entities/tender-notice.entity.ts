import { Audit } from 'megp-shared-be';
import { ETenderNoticeType } from 'src/utils/enums/tender-notice.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tender_notices' })
export class TenderNotice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  objectId: string;

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

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  organizationId: string;

  @Column()
  organizationName: string;

  @Column('timestamp')
  publishmentDate: Date;

  @Column('timestamp')
  closingDate: Date;
}
