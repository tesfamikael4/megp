import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';
import { BidResponseDocumentaryEvidence } from './bid-response-documentary-evidence.entity';

@Entity({ name: 'eqc_documentary_evidences' })
export class EqcDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.eqcDocumentaryEvidences)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column()
  checkOnFirstCompliance: boolean;

  @Column()
  checkOnFirstOpening: boolean;

  @Column()
  checkOnSecondCompliance: boolean;

  @Column()
  checkOnSecondOpening: boolean;

  @Column()
  evidenceTitle: string;

  @Column()
  evidenceType: string;

  @Column({ type: 'uuid', nullable: true })
  spdDocumentaryEvidenceId: string;

  @OneToMany(
    () => BidResponseDocumentaryEvidence,
    (bidResponseDocumentaryEvidences) =>
      bidResponseDocumentaryEvidences.eqcDocumentaryEvidence,
  )
  bidResponseDocumentaryEvidences: BidResponseDocumentaryEvidence[];
}
