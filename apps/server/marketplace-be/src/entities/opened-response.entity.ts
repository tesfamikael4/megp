import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Audit } from 'megp-shared-be';
import { RFX } from './rfx.entity';
import { SolRegistration } from './sol-registration.entity';
import { SolResponse } from './sol-response.entity';
import { RfxDocumentaryEvidence } from './rfx-documentary-evidence.entity';
import { EvalResponse } from './eval-response.entity';

@Entity({ name: 'opened_responses' })
@Unique(['rfxId', 'vendorId', 'rfxDocumentaryEvidenceId'])
export class OpenedResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column({ type: 'jsonb' })
  value: any;

  @Column('uuid')
  rfxDocumentaryEvidenceId: string;

  @ManyToOne(
    () => RfxDocumentaryEvidence,
    (evidence) => evidence.openedResponses,
  )
  @JoinColumn({ name: 'rfxDocumentaryEvidenceId' })
  rfxDocumentaryEvidence: RfxDocumentaryEvidence;

  @Column('uuid')
  solResponseId: string;

  @OneToOne(() => SolResponse, (solResponse) => solResponse.openedResponse)
  @JoinColumn({ name: 'solResponseId' })
  solResponse: SolResponse;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.openedResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.openedResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @OneToMany(() => EvalResponse, (evaluation) => evaluation.openedResponse)
  evalResponses: EvalResponse[];
}
