import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'eqc_due_diligences' })
export class EqcDueDiligence extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.eqcDueDiligences)
  @JoinColumn()
  lot: Lot;

  @Column({ nullable: true })
  requirement: string;

  @Column()
  requirementCondition: string;
}
