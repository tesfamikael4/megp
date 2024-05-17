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
@Check('"deliveryPeriod" > 0')
@Check('"liquidityDamage" >= 0 AND "liquidityDamage" <= 100')
@Check('"liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100')
export class RfxBidContractCondition extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @OneToOne(() => RFX, (rfx) => rfx.rfxBidContractCondition)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  deliveryPeriod: number;

  @Column()
  deliverySite: string;

  @Column()
  warrantyPeriod: number;

  @Column({ default: 0 })
  liquidityDamage: number;

  @Column()
  liquidityDamageLimit: number;

  @Column()
  paymentTerm: string;

  @Column({ type: 'simple-array' })
  paymentMode: string[];

  @Column()
  paymentReleasePeriod: number;
}
