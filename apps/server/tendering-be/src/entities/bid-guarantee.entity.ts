import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { BidGuaranteeTypeEnum } from 'src/shared/enums/bid-guarantee-type.enum';
import { BidGuaranteeStatusEnum } from 'src/shared/enums/bid-guarantee-status.enum';
import { Lot } from './lot.entity';

@Entity({ name: 'bid_guarantees' })
export class BidGuarantee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bidderId: string;

  @Column()
  bidderName: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column()
  organizationName: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @Column({
    type: 'enum',
    enum: BidGuaranteeTypeEnum,
  })
  type: string;

  @Column({ type: 'int', nullable: true })
  minValidityDate: number;

  @Column({ type: 'int', nullable: true })
  revisedValidityDate: number;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  contactPerson: any;

  @Column({ nullable: true })
  hashValue: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'uuid' })
  guarantorId: string;

  @Column()
  guarantorName: string;

  @Column({ type: 'uuid' })
  guarantorBranchId: string;

  @Column()
  guarantorBranchName: string;

  @Column({ nullable: true, type: 'jsonb' })
  document: any;

  @Column({ nullable: true })
  guaranteeReference: string;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({
    type: 'enum',
    enum: BidGuaranteeStatusEnum,
  })
  status: string;

  @ManyToOne(() => Lot, (lot) => lot.bidGuarantee)
  @JoinColumn({ name: 'lotId' })
  lot: Lot[];
}
