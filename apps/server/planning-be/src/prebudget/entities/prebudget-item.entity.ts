import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrebudgetPlan } from './prebudget-plan.entity';
import {
  Currency,
  FundingSource,
  ItemCodeReferenceType,
  ProcurementStatus,
} from '../../shared/enums/enums';
import {
  ProcurementCategoryType,
  ProcurementMethodType,
} from 'src/shared/types/types';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity({ name: 'prebudget_plan_items' })
export class PrebudgetPlanItem extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PrebudgetPlan, (entity) => entity.prebudgetItems)
  @JoinColumn({ name: 'prebudgetId' })
  prebudget: PrebudgetPlan;

  @Column()
  prebudgetId: string;

  @Column({ enum: FundingSource })
  fundingSource: string;

  @Column()
  donorName: string;

  @Column()
  donorId: string;

  @Column({ type: 'jsonb' })
  procurementCategory: ProcurementCategoryType;
  @Column()
  procurementCategoryId: string;

  @Column({ type: 'jsonb' })
  procurementMethod: ProcurementMethodType;
  @Column()
  procurementMethodId: string;

  @Column({ enum: ProcurementStatus })
  procurementStatus: string;

  @Column({ default: false })
  indigenousPreference: boolean;

  @Column({ type: 'smallint', nullable: true })
  MSME: number;

  @Column({ type: 'smallint', nullable: true })
  marginalizedGroups: number;

  @Column({ enum: ItemCodeReferenceType })
  itemCodeReferenceType: string;

  @Column()
  itemCode: string;

  @Column()
  itemCodeDescription: string;

  @Column()
  itemSpecification: string;

  @Column({ enum: Currency })
  currency: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'jsonb' })
  uOM: any;

  @Column()
  uOMId: string;

  @Column()
  quantity: number;

  @Column({ type: 'jsonb', nullable: true })
  frameworkContract: any;

  @Column({ nullable: true })
  frameworkContractId: string;
}
