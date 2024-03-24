import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_professional_settings' })
export class SpdProfessionalSetting extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  requirement: string;

  @Column()
  formLink: string;

  @Column({ type: 'jsonb' })
  validation: any;

  @ManyToOne(() => Spd, (spd) => spd.spdProfessionalSettings)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
