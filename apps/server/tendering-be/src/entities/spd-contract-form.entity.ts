import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';

@Entity({ name: 'spd_contract_forms' })
export class SpdContractForm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  documentDocx: any;

  @Column({ type: 'jsonb', nullable: true })
  documentPdf: any;

  @Column()
  spdId: string;

  @ManyToOne(() => Spd, (spd) => spd.spdContractForm)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;
}
