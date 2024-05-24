import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Audit } from 'megp-shared-be';
import { RFX } from './rfx.entity';
import { SolRegistration } from './sol-registration.entity';

@Entity({ name: 'sol_responses' })
@Unique(['rfxId', 'vendorId', 'key'])
export class SolResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @Column()
  solRegistrationId: string;

  @Column()
  vendorId: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @ManyToOne(() => RFX, (rfx) => rfx.solResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(() => SolRegistration, (registration) => registration.solResponses)
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
