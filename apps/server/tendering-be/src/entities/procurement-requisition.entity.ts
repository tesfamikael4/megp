import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisitionActivity } from './procurement-requisition-activity.entity';
import { ProcurementRequisitionAttachment } from './procurement-requisition-attachment.entity';
import { PostBudgetPlan } from './post-budget-plan.entity';
@Entity({ name: 'procurement_requisitions' })
export class ProcurementRequisition extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  referenceNumber: string;

  @Column({ type: 'double precision' })
  totalEstimatedAmount: number;

  @Column()
  status: string;

  @Column({ type: 'uuid' })
  postBudgetPlanId: string;

  @OneToMany(
    () => ProcurementRequisitionActivity,
    (procurementRequisitionActivity) =>
      procurementRequisitionActivity.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionActivity: ProcurementRequisitionActivity[];

  @OneToMany(
    () => ProcurementRequisitionAttachment,
    (procurementRequisitionAttachments) =>
      procurementRequisitionAttachments.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionAttachments: ProcurementRequisitionAttachment[];

  @ManyToOne(() => PostBudgetPlan, (postBudgetPlan) => postBudgetPlan)
  @JoinColumn({ name: 'postBudgetPlanId' })
  public postBudgetPlan: PostBudgetPlan;
  @BeforeInsert()
  generateRandomNumber(): void {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.referenceNumber = `REF-${randomNum}`;
  }
}
