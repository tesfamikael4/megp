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
import { BudgetCodeResponse } from 'src/shared/entities';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { ProcurementRequisitionDocument } from './procurement-requisition-document.entity';
import { ProcurementRequisitionItem } from './procurement-requisition-item.entity';
import { ProcurementRequisitionTechnicalTeam } from './procurement-requisition-technical-team.entity';
import { ProcurementRequisitionTimeline } from './procurement-requisition-timeline.entity';
import { Budget } from './budget.entity';
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

  @Column({ unique: true })
  userReference: string;

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

  @ManyToOne(() => Budget, (budget) => budget.procurementRequisitions)
  @JoinColumn({ name: 'budgetId' })
  public budget?: Budget;

  @Column({ default: false })
  isPlanned: boolean;

  @Column({ default: false })
  isMultiYear: boolean;

  @Column({ default: false })
  isFundAvailable: boolean;

  @Column({ default: true })
  isCustom: boolean;

  @Column({ nullable: true })
  remark: string;

  @Column({ default: 'Draft' })
  status: string;

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
  procurementMechanisms: ProcurementMechanism[];
  @BeforeInsert()
  generateRandomNumbers(): void {
    const randomNumUser = () => Math.floor(100000 + Math.random() * 900000);
    this.userReference = this.userReference
      ? this.userReference
      : (this.userReference = `uREF-${randomNumUser()}`);
    this.procurementReference = this.procurementReference
      ? this.procurementReference
      : (this.procurementReference = `uREF-${randomNumUser()}`);
  }
}
