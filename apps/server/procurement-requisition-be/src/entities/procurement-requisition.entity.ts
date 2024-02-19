import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  OneToOne,
  Unique,
} from 'typeorm';

import { OrgAudit } from 'src/shared/entities/audit.entity';
import { Document } from './document.entity';
import { Timeline } from './timeline.entity';
import { Item } from './item.entity';
import { ProcurementApplication } from 'src/shared/domain';
import { BudgetCodeResponse } from 'src/shared/entities';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { TechnicalTeam } from './technical-team.entity';
@Entity({ name: 'procurement_requisitions' })
@Unique(['procurementReference', 'deletedAt'])
export class ProcurementRequisition extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  organization: JSON;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  procurementReference: string;

  @Column({ unique: true })
  userReference: string;

  @Column({ type: 'jsonb', nullable: true })
  budgetYear: JSON;

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

  @Column({ type: 'jsonb' })
  budgetCode: BudgetCodeResponse;

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

  @OneToMany(() => Document, (documents) => documents.procurementRequisition, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: Document[];

  @OneToMany(() => Item, (items) => items.procurementRequisition, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: Item[];

  @OneToMany(() => Timeline, (timelines) => timelines.procurementRequisition, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  timelines: Timeline[];

  @OneToMany(
    () => TechnicalTeam,
    (technicalTeams) => technicalTeams.procurementRequisition,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  technicalTeams: TechnicalTeam[];

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
