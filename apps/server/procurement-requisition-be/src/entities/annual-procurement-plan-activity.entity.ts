import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { AnnualProcurementPlanItem } from './annual-procurement-plan-item.entity';
import { AnnualProcurementPlanTimeline } from './annual-procurement-plan-timeline.entity';
import { AnnualProcurementPlanBudgetLine } from './annual-procurement-plan-budget-line.entity';
import { AnnualProcurementPlanDisbursement } from './annual-procurement-plan-disbursement.entity';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { RequisitionerAssignment } from './requisitioner-assignment.entity';

@Entity({ name: 'annual_procurement_plan_activities' })
export class AnnualProcurementPlanActivity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postBudgetPlanId: string;

  @Column()
  procurementReferenceNumber: string;

  @Column()
  activityName: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'double precision',
    default: 0.0,
  })
  estimatedAmount: number;

  @Column({
    type: 'double precision',
    default: 0.0,
  })
  calculatedAmount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column({ default: false })
  isMultipleYear: boolean;

  @Column({ nullable: true })
  remark: string;

  @Column({ type: 'jsonb', nullable: true })
  classification: string;

  @Column({ type: 'uuid' })
  annualProcurementPlanId: string;

  @OneToMany(
    () => AnnualProcurementPlanItem,
    (annualProcurementPlanItems) =>
      annualProcurementPlanItems.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  annualProcurementPlanItems: AnnualProcurementPlanItem[];

  @OneToMany(
    () => AnnualProcurementPlanTimeline,
    (annualProcurementPlanTimelines) =>
      annualProcurementPlanTimelines.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  annualProcurementPlanTimelines: AnnualProcurementPlanTimeline[];

  @OneToMany(
    () => AnnualProcurementPlanBudgetLine,
    (annualProcurementPlanBudgetLines) =>
      annualProcurementPlanBudgetLines.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  annualProcurementPlanBudgetLines: AnnualProcurementPlanBudgetLine[];

  @OneToMany(
    () => AnnualProcurementPlanDisbursement,
    (annualProcurementPlanDisbursements) =>
      annualProcurementPlanDisbursements.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  annualProcurementPlanDisbursements: AnnualProcurementPlanDisbursement[];

  @OneToOne(
    () => ProcurementMechanism,
    (procurementMechanisms) =>
      procurementMechanisms.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementMechanisms: ProcurementMechanism;

  @OneToMany(
    () => RequisitionerAssignment,
    (requisitionerAssignments) =>
      requisitionerAssignments.annualProcurementPlanActivity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  requisitionerAssignments: RequisitionerAssignment[];
}
