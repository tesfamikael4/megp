import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanInitiation } from './plan-initiation.entity';
import { PrebudgetPlanItem } from './prebudget-item.entity';
import { PrebudgetPlanStatus } from '../../shared/enums/enums';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity({ name: 'prebudget_plans' })
export class PrebudgetPlan extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  procurementReference: string;

  @OneToOne(() => PlanInitiation)
  @JoinColumn({ name: 'planInitiationId' })
  planInitiation: PlanInitiation;

  @Column()
  planInitiationId: string;

  @Column({ enum: PrebudgetPlanStatus, default: PrebudgetPlanStatus.Created })
  preplanStatus: string;

  @OneToMany(() => PrebudgetPlanItem, (e) => e.prebudget)
  prebudgetItems: PrebudgetPlanItem[];

  @Column({ type: 'date', nullable: true })
  approvedOn: Date;

  @Column({ nullable: true })
  approverName: string;

  @Column({ nullable: true })
  remark: string;

  @Column({ nullable: true })
  description: string;
}
