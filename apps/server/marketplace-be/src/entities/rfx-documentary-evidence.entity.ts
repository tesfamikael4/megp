import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { EvalResponse } from './eval-response.entity';
import { SolResponse } from './sol-response.entity';
import { OpenedResponse } from './opened-response.entity';

@Entity({ name: 'rfx_documentary_evidences' })
@Unique(['rfxId', 'documentTitle'])
@Unique(['rfxId', 'order'])
export class RfxDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentTitle: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  required: boolean;

  @Column({ default: 1 })
  order: number;

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxDocumentaryEvidences)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToMany(
    () => EvalResponse,
    (evalResponse) => evalResponse.rfxDocumentaryEvidence,
  )
  evalResponses: EvalResponse[];

  @OneToMany(
    () => SolResponse,
    (solResponse) => solResponse.rfxDocumentaryEvidence,
  )
  solResponses: SolResponse[];

  @OneToMany(
    () => OpenedResponse,
    (solResponse) => solResponse.rfxDocumentaryEvidence,
  )
  openedResponses: OpenedResponse[];
}
