import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'preference_margins' })
export class PreferenceMargin extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.preferenceMargins)
  @JoinColumn()
  lot: Lot;

  @Column({ nullable: true })
  name: string;

  @Column()
  condition: string;

  @Column()
  margin: number;
}
