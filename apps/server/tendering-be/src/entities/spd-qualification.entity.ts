import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_qualifications' })
export class SpdQualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  category: string;

  @Column()
  factor: string;

  @Column({ type: 'text' })
  requirement: string;

  @Column()
  attribute: string;

  @Column()
  value: string;

  @Column({ type: 'jsonb' })
  singleEntityCondition: any;

  @Column({ type: 'jsonb' })
  jvCominedCondition: any;

  @Column({ type: 'jsonb' })
  jvEachPartherCondition: any;

  @Column({ type: 'jsonb' })
  jvAtleastOnePartnerCondition: any;

  @Column()
  order: string;

  @Column()
  formLink: string;

  @Column()
  mandate: string;

  @Column()
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.qualifications)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
