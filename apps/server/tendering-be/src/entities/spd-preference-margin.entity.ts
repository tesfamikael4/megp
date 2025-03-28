import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { Spd } from './spd.entity';

@Entity({ name: 'spd_preference_margins' })
export class SpdPreferenceMargin extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  condition: string;

  @Column()
  description: string;

  @Column()
  margin: string;

  @Column()
  itbReference: string;

  @Column({ type: 'text', nullable: true })
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.spdPreferenceMargins)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
