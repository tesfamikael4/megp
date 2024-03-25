import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PreBudgetPlanActivity } from './pre-budget-plan-activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'pre_procurement_mechanisms' })
export class PreProcurementMechanism extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  preBudgetPlanActivityId: string;

  @OneToOne(
    () => PreBudgetPlanActivity,
    (preBudgetPlanActivity) => preBudgetPlanActivity.preProcurementMechanism,
  )
  @JoinColumn({ name: 'preBudgetPlanActivityId' })
  public preBudgetPlanActivity: PreBudgetPlanActivity;

  @Column()
  fundingSource: string;

  @Column()
  procurementMethod: string;

  @Column()
  procurementType: string;

  @Column({ type: 'jsonb' })
  donor: any;

  @Column({ type: 'jsonb' })
  targetGroup: any;

  @Column()
  isOnline: boolean;

  @Column({ type: 'json' })
  contract: JSON;
}
