import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_administrative_compliances' })
export class SpdAdministrativeCompliance extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  itbDescription: string;

  @Column()
  attribute: string;

  @Column()
  value: string;

  @Column()
  mandate: string;

  @Column({ type: 'integer', unsigned: true })
  order: number;

  @Column()
  isRequired: boolean;

  @ManyToOne(() => Spd, (spd) => spd.spdAdministrativeCompliances)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
