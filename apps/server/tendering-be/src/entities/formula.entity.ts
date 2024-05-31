import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FormulaUnit } from './formula-unit.entity';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Item } from './tender-item.entity';

@Entity({ name: 'formulas' })
export class Formula extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.formulas)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.formulas)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @OneToMany(() => FormulaUnit, (formulaUnit) => formulaUnit.formula)
  formulaUnits: FormulaUnit[];
}
