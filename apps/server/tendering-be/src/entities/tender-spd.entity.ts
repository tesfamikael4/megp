import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_spds' })
export class TenderSpd extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.spd)
  @JoinColumn()
  tender: Tender;

  @Column()
  spdId: string;

  @OneToOne(() => Spd, (spd) => spd.tenderSpd)
  @JoinColumn()
  spd: Spd;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  bds: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  scc: any;
}
