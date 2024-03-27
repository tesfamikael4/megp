import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';

@Entity({ name: 'spd_opening_checklists' })
export class SpdOpeningChecklist extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  name: string;

  @Column()
  isBoolean: boolean;

  @Column()
  type: string;

  @ManyToOne(() => Spd, (spd) => spd.spdOpeningChecklists)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
