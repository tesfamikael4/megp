import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Item } from './tender-item.entity';
import { FinancialPriceAnalysisDetail } from './financial-price-analysis-detail.entity';

@Entity({ name: 'financial_price_analyses' })
export class FinancialPriceAnalysis extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.financialPriceAnalyses)
  @JoinColumn({ name: 'lotId' })
  lot: Lot;

  @Column('uuid')
  bidderId: string;

  @Column()
  bidderName: string;

  @OneToMany(
    () => FinancialPriceAnalysisDetail,
    (financialPriceAnalysisDetail) =>
      financialPriceAnalysisDetail.financialPriceAnalyses,
  )
  financialPriceAnalysisDetails: FinancialPriceAnalysisDetail[];

  @Column({ default: false })
  isComplete: boolean;
}
