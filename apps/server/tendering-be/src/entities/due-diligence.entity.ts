import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'due_diligence' })
export class DueDiligence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.dueDelegences)
  @JoinColumn()
  lot: Lot;

  @Column({ nullable: true })
  requirement: string;

  @Column()
  requirementCondition: string;
}
