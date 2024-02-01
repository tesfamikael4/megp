import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_required_documentary_evidences' })
export class SpdRequiredDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spdId: string;

  @Column({ type: 'jsonb' })
  sectionLink: any;

  @Column({ type: 'jsonb' })
  evidenceType: any;

  @Column()
  evidenceTitle: string;

  @Column()
  checkOnFirstOpening: boolean;

  @Column()
  checkOnSecondOpening: boolean;

  @Column()
  checkOnSecondCompliance: boolean;

  @Column()
  requiredTo: string;

  @Column()
  isRequired: boolean;

  @ManyToOne(() => Spd, (spd) => spd.spdRequiredDocumentaryEvidences)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
