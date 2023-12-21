import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpdEntity } from './spd.entity';

@Entity({ name: 'spd-settings' })
export class SpdSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  spdId: string;
  @Column()
  content: string;

  @ManyToOne(() => SpdEntity, (spd) => spd.spdSettings)
  @JoinColumn({ name: 'spdId' })
  spd: SpdEntity;
}
