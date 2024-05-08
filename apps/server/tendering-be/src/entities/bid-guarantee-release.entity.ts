import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BidGuarantee } from './bid-guarantee.entity';
import { BidGuaranteeReleaseEnum } from 'src/shared/enums';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'bid_guarantee_releases' })
export class BidGuaranteeRelease extends Audit {
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
    enum: BidGuaranteeReleaseEnum,
  })
  status: BidGuaranteeReleaseEnum;
  @ManyToOne(() => BidGuarantee, (guarantee) => guarantee.releases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: BidGuarantee;
}
