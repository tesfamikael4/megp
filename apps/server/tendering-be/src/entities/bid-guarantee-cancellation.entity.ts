import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidGuarantee } from './bid-guarantee.entity';
import { BidGuaranteeCancellationEnum } from 'src/shared/enums';

@Entity({ name: 'bid_guarantee_cancellations' })
export class BidGuaranteeCancellation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  guaranteeId: string;
  @Column()
  reason: string;
  @Column({ nullable: true })
  remark: string;
  @Column({
    type: 'enum',
    enum: BidGuaranteeCancellationEnum,
  })
  status: BidGuaranteeCancellationEnum;
  @ManyToOne(() => BidGuarantee, (guarantee) => guarantee.cancellations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: BidGuarantee;
}
