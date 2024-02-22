import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'eqc_preference_margins' })
export class EqcPreferenceMargin extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.eqcPreferenceMargins)
  @JoinColumn()
  lot: Lot;

  @Column({ nullable: true })
  name: string;

  @Column()
  condition: string;

  @Column()
  margin: number;
}
