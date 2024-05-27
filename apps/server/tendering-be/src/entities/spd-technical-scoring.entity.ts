import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';
import { SpdBidForm } from './spd-bid-form.entity';

@Entity({ name: 'spd_technical_scoring' })
export class SpdTechnicalScoring extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(
    () => SpdTechnicalScoring,
    (technicalScoring) => technicalScoring.children,
  )
  @JoinColumn()
  parent: SpdTechnicalScoring;

  @OneToMany(
    () => SpdTechnicalScoring,
    (technicalScoring) => technicalScoring.parent,
  )
  children: SpdTechnicalScoring[];

  @Column()
  requirement: string;

  @Column()
  bidFromId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.spdTechnicalScorings)
  @JoinColumn({ name: 'bidFromId' })
  bidFrom: SpdBidForm;

  @Column()
  isProfessional: boolean;

  @Column({ type: 'jsonb' })
  validation: any;

  @ManyToOne(() => Spd, (spd) => spd.spdTechnicalScores)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
