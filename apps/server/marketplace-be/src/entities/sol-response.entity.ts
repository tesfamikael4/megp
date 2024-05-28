import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Audit } from 'megp-shared-be';
import { RFX } from './rfx.entity';
import { SolRegistration } from './sol-registration.entity';
import { OpenedResponse } from './opened-response.entity';

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

  @OneToOne(() => OpenedResponse, (rfx) => rfx.solResponse)
  openedResponse: OpenedResponse;

  @ManyToOne(() => RFX, (rfx) => rfx.openedResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(() => SolRegistration, (registration) => registration.solResponses)
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
