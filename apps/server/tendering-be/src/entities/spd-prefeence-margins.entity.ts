import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { SpdEntity } from './spd.entity';

@Entity({ name: 'spd-prefeence-margins' })
export class SpdPrefeenceMargins extends Audit {
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

  @ManyToOne(() => SpdEntity, (spd) => spd.spdPrefeenceMargins)
  @JoinColumn({ name: 'spdId' })
  spd: SpdEntity;
}
