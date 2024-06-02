import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { PriceAdjustingFactorEnum } from 'src/shared/enums/price-adjusting-factor.enum';
import { Item } from './tender-item.entity';
import { FinancialBidPriceAssessment } from './financial-bid-price-assessment.entity';

@Entity({ name: 'formula_implementations' })
@Unique(['lotId', 'name'])
export class FormulaImplementation extends OrgAudit {
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

  @Column({
    type: 'enum',
    enum: PriceAdjustingFactorEnum,
  })
  type: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.formulaImplementations)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @OneToOne(
    () => FinancialBidPriceAssessment,
    (financialBidPriceAssessment) =>
      financialBidPriceAssessment.formulaImplementation,
  )
  financialBidPriceAssessment: FinancialBidPriceAssessment;

  @Column({ type: 'uuid' })
  bidderId: string;

  @Column({ nullable: true })
  result: number;

  // @Column()
  // formulaId: string;

  // @ManyToOne(() => Formula, (formula) => formula.formulaUnits)
  // @JoinColumn({ name: 'formulaId' })
  // formula: Formula;
}
