import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from './lot.entity';
import { SorTechnicalRequirement } from './sor-technical-requirement.entity';
import { SorReimburseableExpense } from './sor-reimburseable-expense.entity';
import { SorBillOfMaterial } from './sor-bill-of-material.entity';
import { SorEquipment } from './sor-equipment.entity';
import { SorFee } from './sor-fee.entity';
import { SorIncidentalCost } from './sor-incidental-cost.entity';
import { SorLabor } from './sor-labor.entity';
import { SorDocument } from './sor-document.entity';
import { BidResponseItem } from './bid-response-item.entity';
import { OpenedBidResponseItem } from './opened-bid-response-item.entity';
import { PriceAdjustingFactor } from './price-adjusting-factor.entity';
import { FinancialBidPriceAssessment } from './financial-bid-price-assessment.entity';
import { ItemStatusEnum } from 'src/shared/enums/tender-status.enum';
import { FormulaImplementation } from './formula-implementation.entity';
import { FinancialPriceAnalysisDetail } from './financial-price-analysis-detail.entity';

@Entity({ name: 'items' })
export class Item extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.items)
  @JoinColumn()
  lot: Lot;

  @Column()
  itemCode: string;

  @Column()
  procurementCategory: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unitOfMeasure: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedPrice: number;

  @Column()
  estimatedPriceCurrency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice: number;

  @Column({ nullable: true })
  marketPriceCurrency: string;

  @Column()
  hasBom: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metaData: any;

  @Column({
    type: 'enum',
    enum: ItemStatusEnum,
    default: ItemStatusEnum.ACTIVE,
  })
  status: string;

  @OneToMany(
    () => SorTechnicalRequirement,
    (technicalRequirement) => technicalRequirement.item,
  )
  technicalRequirements: SorTechnicalRequirement[];

  @OneToMany(
    () => SorReimburseableExpense,
    (reimburseableExpense) => reimburseableExpense.item,
  )
  reimburseableExpense: SorReimburseableExpense[];

  @OneToMany(() => SorBillOfMaterial, (billOfMaterial) => billOfMaterial.item)
  billOfMaterials: SorBillOfMaterial[];

  @OneToMany(() => SorEquipment, (equipment) => equipment.item)
  equipments: SorEquipment[];

  @OneToMany(() => SorFee, (fee) => fee.item)
  fees: SorFee[];

  @OneToMany(() => SorIncidentalCost, (incidentalCost) => incidentalCost.item)
  incidentalCosts: SorIncidentalCost[];

  @OneToMany(() => SorLabor, (labor) => labor.item)
  labors: SorLabor[];

  @OneToMany(() => SorDocument, (documents) => documents.item)
  documents: SorDocument[];

  @OneToMany(() => BidResponseItem, (bidResponseItems) => bidResponseItems.item)
  bidResponseItems: BidResponseItem[];

  @OneToMany(
    () => OpenedBidResponseItem,
    (bidResponseItems) => bidResponseItems.item,
  )
  openedBidResponseItems: OpenedBidResponseItem[];

  @OneToMany(
    () => PriceAdjustingFactor,
    (priceAdjustingFactor) => priceAdjustingFactor.item,
  )
  priceAdjustingFactors: PriceAdjustingFactor[];

  @OneToMany(
    () => FinancialBidPriceAssessment,
    (financialBidPriceAssessments) => financialBidPriceAssessments.item,
  )
  financialBidPriceAssessments: FinancialBidPriceAssessment[];

  @OneToMany(
    () => FormulaImplementation,
    (formulaImplementation) => formulaImplementation.item,
  )
  formulaImplementations: FormulaImplementation[];

  @OneToMany(
    () => FinancialPriceAnalysisDetail,
    (financialPriceAnalysisDetail) => financialPriceAnalysisDetail.item,
  )
  financialPriceAnalysisDetails: FinancialPriceAnalysisDetail[];
}
