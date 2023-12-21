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

  @Column()
  spdId: string;

  @Column()
  condition: string;

  @Column()
  name: string;
  @Column()
  preferenceType: string;

  @Column({ type: 'numeric' })
  margin: number;

  @ManyToOne(() => Spd, (spd) => spd.spdPreferenceMargins)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
