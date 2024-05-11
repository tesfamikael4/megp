import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'rfx_procurement_mechanisms' })
export class RfxProcurementMechanism extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @OneToOne(() => RFX, (rfx) => rfx.rfxProcurementMechanism)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column({ type: 'json', nullable: true })
  PRRfxProcurementMechanisms: any;
}
