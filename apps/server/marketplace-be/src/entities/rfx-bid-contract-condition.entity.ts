import { Audit } from 'megp-shared-be';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_bid_contract_conditions' })
@Check('"liquidityDamageLimit" >=  "liquidityDamage"')
@Check('"liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100')
export class RfxBidContractCondition extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  liquidityDamage: number;

  @Column()
  liquidityDamageLimit: number;

  @Column({ default: false })
  isPartialAllowed: boolean;

  @Column()
  paymentReleasePeriod: number;

  @Column()
  rfxId: string;

  @OneToOne(() => RFX, (rfx) => rfx.rfxBidContractCondition)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;
}
