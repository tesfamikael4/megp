import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';

@Entity({ name: 'spd_settings' })
export class SpdSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spdId: string;

  @Column()
  content: string;

  @ManyToOne(() => Spd, (spd) => spd.spdSettings)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
