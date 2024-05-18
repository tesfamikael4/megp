import { Audit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BidRegistrationDetail } from './bid-registration-detail.entity';
import { EqcDocumentaryEvidence } from './eqc-documentary-evidence.entity';
import { DocumentTypeEnum } from 'src/shared/enums';

@Entity({ name: 'bid_response_documentary_evidences' })
@Unique(['bidRegistrationDetailId', 'eqcDocumentaryEvidenceId'])
export class BidResponseDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bidRegistrationDetailId: string;

  @ManyToOne(() => BidRegistrationDetail, (tender) => tender.bidResponseItems)
  @JoinColumn()
  bidRegistrationDetail: BidRegistrationDetail;

  @Column()
  eqcDocumentaryEvidenceId: string;

  @ManyToOne(
    () => EqcDocumentaryEvidence,
    (eqcDocumentaryEvidence) =>
      eqcDocumentaryEvidence.bidResponseDocumentaryEvidences,
  )
  @JoinColumn()
  eqcDocumentaryEvidence: EqcDocumentaryEvidence;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  documentType: string;

  @Column({ type: 'text' })
  value: string;
}
