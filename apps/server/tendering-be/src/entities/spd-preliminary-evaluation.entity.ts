import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { Spd } from './spd.entity';
import { SpdBidForm } from './spd-bid-form.entity';

@Entity({ name: 'spd_preliminary_evaluations' })
export class SpdPreliminaryEvaluation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  criteria: string;

  @Column()
  type: string;

  @Column()
  itbReference: string;

  @Column({ type: 'text', nullable: true })
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.spdPreliminaryEvaluations)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

  @Column()
  bidFromId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.spdPreliminaryEvaluations)
  @JoinColumn({ name: 'bidFromId' })
  bidFrom: SpdBidForm;
}
