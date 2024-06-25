import { Audit } from 'megp-shared-be';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_contract_terms' })
@Unique(['rfxId', 'term'])
@Unique(['rfxId', 'order'])
export class RfxContractTerm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  term: string;

  @Column()
  order: number;

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxContractTerms)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;
}
