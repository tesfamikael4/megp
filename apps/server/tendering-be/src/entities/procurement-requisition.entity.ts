import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  OneToOne,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProcurementRequisitionActivity } from './procurement-requisition-activity.entity';
import { ProcurementRequisitionDocument } from './procurement-requisition-document.entity';
import { ProcurementRequisitionTimeline } from './procurement-requisition-timeline.entity';
import { ProcurementRequisitionOfficerAssignment } from './procurement-requisition-officer-assignment.entity';
import { ProcurementRequisitionItem } from './procurement-requisition-item.entity';
import { ProcurementRequisitionMechanism } from './procurement-requisition-mechanism.entity';
import { ProcurementRequisitionDisbursement } from './procurement-requisition-disbursement.entity';
import { ProcurementRequisitionBudgetLine } from './procurement-requisition-budget-line.entity';
@Entity({ name: 'procurement_requisitions' })
@Unique(['userReferenceNumber', 'requisitionReferenceNumber'])
export class ProcurementRequisition extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  organization: JSON;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  requisitionReferenceNumber: string;

  @Column({ unique: true })
  userReferenceNumber: string;

  @Column({ type: 'jsonb' })
  budgetYear: JSON;

  @Column({
    type: 'double precision',
    default: 0.0,
  })
  totalEstimatedAmount: number;

  @Column({
    type: 'double precision',
    default: 0.0,
  })
  calculatedAmount: number;

  @Column()
  currency: string;

  @Column({ default: 'Draft' })
  status: string;

  @OneToMany(
    () => ProcurementRequisitionActivity,
    (procurementRequisitionActivities) =>
      procurementRequisitionActivities.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionActivities: ProcurementRequisitionActivity[];

  @OneToMany(
    () => ProcurementRequisitionDocument,
    (procurementRequisitionDocuments) =>
      procurementRequisitionDocuments.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionDocuments: ProcurementRequisitionDocument[];

  @OneToMany(
    () => ProcurementRequisitionItem,
    (procurementRequisitionItems) =>
      procurementRequisitionItems.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionItems: ProcurementRequisitionItem[];

  @OneToMany(
    () => ProcurementRequisitionTimeline,
    (procurementRequisitionTimelines) =>
      procurementRequisitionTimelines.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionTimelines: ProcurementRequisitionTimeline[];

  @OneToMany(
    () => ProcurementRequisitionOfficerAssignment,
    (procurementRequisitionOfficerAssignments) =>
      procurementRequisitionOfficerAssignments.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionOfficerAssignments: ProcurementRequisitionOfficerAssignment[];

  @OneToOne(
    () => ProcurementRequisitionMechanism,
    (procurementRequisitionMechanisms) =>
      procurementRequisitionMechanisms.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionMechanisms: ProcurementRequisitionMechanism[];

  @OneToMany(
    () => ProcurementRequisitionBudgetLine,
    (procurementRequisitionBudgetLines) =>
      procurementRequisitionBudgetLines.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionBudgetLines: ProcurementRequisitionBudgetLine[];

  @OneToMany(
    () => ProcurementRequisitionDisbursement,
    (procurementRequisitionDisbursements) =>
      procurementRequisitionDisbursements.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  procurementRequisitionDisbursements: ProcurementRequisitionDisbursement[];

  @BeforeInsert()
  generateRandomNumbers(): void {
    const randomNumReq = () => Math.floor(100000 + Math.random() * 900000);
    const randomNumUser = () => Math.floor(100000 + Math.random() * 900000);

    this.requisitionReferenceNumber = `REF-${randomNumReq()}`;
    this.userReferenceNumber = `REF-${randomNumUser()}`;
  }
}
