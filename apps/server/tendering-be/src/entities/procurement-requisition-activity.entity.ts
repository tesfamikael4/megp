import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisition } from './procurement-requisition.entity';
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';

@Entity({ name: 'procurement_requisition_activities' })
export class ProcurementRequisitionActivity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  procurementRequisitionId: string;

  @Column({ type: 'uuid' })
  postBudgetPlanActivityId: string;

  @ManyToOne(
    () => ProcurementRequisition,
    (procurementRequisition) =>
      procurementRequisition.procurementRequisitionActivity,
  )
  @JoinColumn({ name: 'procurementRequisitionId' })
  public procurementRequisition: ProcurementRequisition;

  @ManyToOne(() => PostBudgetPlanActivity)
  @JoinColumn({ name: 'postBudgetPlanActivityId' })
  public postBudgetPlanActivity: PostBudgetPlanActivity;
}
