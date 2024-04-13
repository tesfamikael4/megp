import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from '.';

@Entity({ name: 'spd_documentary_evidences' })
export class SpdDocumentaryEvidence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spdId: string;

  @ManyToOne(() => Spd, (spd) => spd.spdDocumentaryEvidences)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

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
}
