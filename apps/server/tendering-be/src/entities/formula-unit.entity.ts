import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';

@Entity({ name: 'formula_units' })
@Unique(['lotId', 'name'])
export class FormulaUnit extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  representation: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.formulaUnits)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  // @Column()
  // formulaId: string;

  // @ManyToOne(() => Formula, (formula) => formula.formulaUnits)
  // @JoinColumn({ name: 'formulaId' })
  // formula: Formula;
}
