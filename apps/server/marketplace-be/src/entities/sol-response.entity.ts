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
import { RfxDocumentaryEvidence } from './rfx-documentary-evidence.entity';

@Entity({ name: 'sol_responses' })
@Unique(['rfxId', 'solRegistrationId', 'rfxDocumentaryEvidenceId'])
export class SolResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column({ type: 'text' })
  value: string;

  @Column('uuid')
  rfxDocumentaryEvidenceId: string;

  @ManyToOne(() => RfxDocumentaryEvidence, (evidence) => evidence.solResponses)
  @JoinColumn({ name: 'rfxDocumentaryEvidenceId' })
  rfxDocumentaryEvidence: RfxDocumentaryEvidence;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.openedResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(() => SolRegistration, (registration) => registration.solResponses)
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @OneToOne(() => OpenedResponse, (rfx) => rfx.solResponse)
  openedResponse: OpenedResponse;
}
