import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_documentary_evidence' })
@Unique(['rfxId', 'documentTitle'])
@Unique(['rfxId', 'order'])
export class RfxDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxDocumentaryEvidences)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  documentTitle: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  required: boolean;

  @Column({ default: 1 })
  order: number;
}
