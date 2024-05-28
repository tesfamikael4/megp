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
import { SolResponse } from './sol-response.entity';

@Entity({ name: 'opened_responses' })
@Unique(['rfxId', 'vendorId', 'key'])
export class OpenedResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  // Foreign Keys
  @Column('uuid')
  rfxId: string;

  @Column('uuid')
  solResponseId: string;

  @Column('uuid')
  solRegistrationId: string;

  // Relations
  @OneToOne(() => SolResponse, (solResponse) => solResponse.openedResponse)
  @JoinColumn({ name: 'solResponseId' })
  solResponse: SolResponse;

  @ManyToOne(() => RFX, (rfx) => rfx.openedResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.openedResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
