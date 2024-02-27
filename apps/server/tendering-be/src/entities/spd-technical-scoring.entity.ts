import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_technical_scoring' })
export class SpdTechnicalScoring extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column({ type: 'uuid' })
  parentId: string;

  @Column()
  requirement: string;

  @Column()
  formLink: string;

  @Column()
  isProfessional: boolean;

  @Column({ type: 'jsonb' })
  validation: any;

  @ManyToOne(() => Spd, (spd) => spd.spdTechnicalScores)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
