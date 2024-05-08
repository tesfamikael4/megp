import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BidGuarantee } from './bid-guarantee.entity';
import { BidGuaranteeExtensionEnum } from 'src/shared/enums';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'bid_guarantee_extensions' })
export class BidGuaranteeExtension extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  guaranteeId: string;
  @Column()
  reason: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ type: 'int' })
  noOfDays: number;
  @Column({
    type: 'enum',
    enum: BidGuaranteeExtensionEnum,
  })
  status: BidGuaranteeExtensionEnum;
  @ManyToOne(() => BidGuarantee, (guarantee) => guarantee.guaranteeExtensions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: BidGuarantee;
}
