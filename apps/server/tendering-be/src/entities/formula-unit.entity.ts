import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Formula } from './formula.entity';

@Entity({ name: 'formula_units' })
@Unique(['formulaId', 'name'])
export class FormulaUnit extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  representation: string;

  @Column()
  formulaId: string;

  @ManyToOne(() => Formula, (formula) => formula.formulaUnits)
  @JoinColumn({ name: 'formulaId' })
  formula: Formula;
}
