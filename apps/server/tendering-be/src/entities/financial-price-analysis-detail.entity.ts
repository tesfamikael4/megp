import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Item } from './tender-item.entity';
import { FinancialPriceAnalysis } from './financial-price-analysis.entity';

@Entity({ name: 'financial_price_analyses_details' })
export class FinancialPriceAnalysisDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.financialPriceAnalysisDetails)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column({ type: 'uuid' })
  financialPriceAnalysisId: string;

  @ManyToOne(
    () => FinancialPriceAnalysis,
    (financialPriceAnalysis) =>
      financialPriceAnalysis.financialPriceAnalysisDetails,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'financialPriceAnalysisId' })
  financialPriceAnalyses: FinancialPriceAnalysis;

  @Column('uuid')
  evaluatorId: string;

  @Column()
  evaluatorName: string;

  @Column()
  currency: string;

  @Column()
  calculatedBidUnitPrice: number;

  @Column()
  marketUnitPrice: number;

  @Column()
  difference: number;
}
