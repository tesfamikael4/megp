import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BidGuarantee } from './bid-guarantee.entity';
import { Audit } from 'src/shared/entities';
import { BidGuaranteeForefitStatusEnum } from 'src/shared/enums';

@Entity({ name: 'bid_guarantee_forfeits' })
export class BidGuaranteeForfeit extends Audit {
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
    enum: BidGuaranteeForefitStatusEnum,
  })
  status: BidGuaranteeForefitStatusEnum;
  @ManyToOne(() => BidGuarantee, (guarantee) => guarantee.forfeits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: BidGuarantee;
}
