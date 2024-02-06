import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanActivity } from './annual-procurement-plan-activity.entity';
@Entity({ name: 'annual_procurement_plan_items' })
export class AnnualProcurementPlanItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemCode: string;

  @Column()
  description: string;

  @Column({ type: 'double precision', default: 0.0 })
  unitPrice: number;

  @Column({ type: 'double precision', default: 0.0 })
  quantity: number;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: true })
  measurement: string;

  @Column({ nullable: true })
  uomName: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanActivityId: string;

  @ManyToOne(
    () => AnnualProcurementPlanActivity,
    (annualProcurementPlanActivity) =>
      annualProcurementPlanActivity.annualProcurementPlanItems,
  )
  @JoinColumn({ name: 'annualProcurementPlanActivityId' })
  public annualProcurementPlanActivity: AnnualProcurementPlanActivity;
}
