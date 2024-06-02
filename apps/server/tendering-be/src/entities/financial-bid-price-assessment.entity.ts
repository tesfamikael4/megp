import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { ExchangeRateDetail } from './exchange-rate-detail.entity';
import { Item } from './tender-item.entity';
import { FormulaImplementation } from './formula-implementation.entity';

@Entity({ name: 'financial_bid_price_assessments' })
export class FinancialBidPriceAssessment extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.financialBidPriceAssessments)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.financialBidPriceAssessments)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column({ type: 'uuid' })
  formulaImplementationId: string;

  @OneToOne(
    () => FormulaImplementation,
    (formulaImplementation) =>
      formulaImplementation.financialBidPriceAssessment,
  )
  @JoinColumn({ name: 'formulaImplementationId' })
  formulaImplementation: FormulaImplementation;

  @Column('uuid')
  evaluatorId: string;

  @Column('uuid')
  evaluatorName: string;

  @Column()
  isTeamLead: boolean;

  @Column()
  offeredPrice: number;

  @Column()
  bidPrice: number;
}
