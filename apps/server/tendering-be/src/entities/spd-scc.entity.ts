import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';
@Entity({ name: 'spd_scc' })
export class SpdScc extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spdId: string;

  @Column()
  category: string;

  @Column()
  itbReference: string;

  @Column()
  attribute: string;

  @Column({ type: 'jsonb', nullable: true })
  value: any;

  @Column()
  mandate: string;

  @Column()
  inputType: string;

  @Column({ type: 'int4' })
  order: number;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  dependency: any;

  @Column()
  readOnly: boolean;

  @Column()
  isRequired: boolean;

  @Column()
  prefix: string;

  @ManyToOne(() => Spd, (spd) => spd.sccs)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
