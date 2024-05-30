import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  OneToOne,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { ProcurementApplication } from 'src/shared/domain';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { ProcurementRequisitionDocument } from './procurement-requisition-document.entity';
import { ProcurementRequisitionItem } from './procurement-requisition-item.entity';
import { ProcurementRequisitionTechnicalTeam } from './procurement-requisition-technical-team.entity';
import { ProcurementRequisitionTimeline } from './procurement-requisition-timeline.entity';
import { Budget } from './budget.entity';
import { ProcurementRequisitionStatusEnum } from 'src/shared/enums';
import { PostBudgetPlan } from './post-budget-plan.entity';
import { Reason } from './reason.entity';
import { BudgetYear } from './budget-year.entity';
import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
@Entity({ name: 'procurement_requisitions' })
@Unique(['procurementReference', 'deletedAt'])
export class ProcurementRequisition extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  procurementReference: string;

  @Column({ nullable: true })
  userReference: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  totalEstimatedAmount: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  calculatedAmount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ProcurementApplication,
    default: ProcurementApplication.TENDERING,
  })
  procurementApplication: ProcurementApplication;

  @Column({ nullable: true })
  budgetId: string;

  @Column({ nullable: true })
  budgetYearId: string;

  @Column({ nullable: true })
  postBudgetPlanId: string;

  @ManyToOne(
    () => PostBudgetPlan,
    (postBudgetPlan) => postBudgetPlan.procurementRequisitions,
  )
  @JoinColumn({ name: 'postBudgetPlanId' })
  public postBudgetPlan: PostBudgetPlan;

  @ManyToOne(() => Budget, (budget) => budget.procurementRequisitions)
  @JoinColumn({ name: 'budgetId' })
  public budget?: Budget;

  @Column({ default: false })
  isPlanned: boolean;

  @Column({ default: false })
  isMultiYear: boolean;

  @Column({ default: false })
  isFundAvailable: boolean;

  @Column({ nullable: true })
  postBudgetPlanActivityId: string;

  @Column({ nullable: true })
  remark: string;

  @Column({
    type: 'enum',
    enum: ProcurementRequisitionStatusEnum,
    default: ProcurementRequisitionStatusEnum.DRAFT,
  })
  public status: string;

  @OneToMany(
    () => ProcurementRequisitionDocument,
    (documents) => documents.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionDocuments: ProcurementRequisitionDocument[];

  @OneToMany(
    () => ProcurementRequisitionItem,
    (items) => items.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionItems: ProcurementRequisitionItem[];

  @OneToMany(
    () => ProcurementRequisitionTimeline,
    (timelines) => timelines.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionTimelines: ProcurementRequisitionTimeline[];

  @OneToMany(
    () => ProcurementRequisitionTechnicalTeam,
    (technicalTeams) => technicalTeams.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionTechnicalTeams: ProcurementRequisitionTechnicalTeam[];

  @OneToOne(
    () => ProcurementMechanism,
    (procurementMechanisms) => procurementMechanisms.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementMechanisms: ProcurementMechanism;

  @ManyToOne(
    () => BudgetYear,
    (budgetYear) => budgetYear.procurementRequisitions,
  )
  @JoinColumn({ name: 'budgetYearId' })
  public budgetYear?: BudgetYear;

  @OneToMany(() => Reason, (reasons) => reasons.procurementRequisition)
  reasons: Reason[];

  @ManyToOne(
    () => PostBudgetPlanActivity,
    (postBudgetActivity) => postBudgetActivity.procurementRequisitions,
  )
  @JoinColumn({ name: 'postBudgetActivityId' })
  public postBudgetActivity?: PostBudgetPlanActivity;

  @BeforeInsert()
  generateRandomNumbers(): void {
    const randomNumUser = () => Math.floor(100000 + Math.random() * 900000);

    this.procurementReference = this.procurementReference
      ? this.procurementReference
      : (this.procurementReference = `REF-${randomNumUser()}`);
  }
}
