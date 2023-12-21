import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpdEntity } from './spd.entity';

@Entity({ name: 'spd-required-documentary-evidences' })
export class SpdRequiredDocumentaryEvidences {
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
  checkOnSecondCompilance: boolean;

  @Column()
  requiredTo: string;

  @Column()
  isRequired: boolean;

  @ManyToOne(() => SpdEntity, (spd) => spd.spdRequiredDocumentaryEvidences)
  @JoinColumn({ name: 'spdId' })
  spd: SpdEntity;
}
