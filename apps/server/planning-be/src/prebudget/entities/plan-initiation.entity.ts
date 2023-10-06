import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlanInitiationStatus } from '../../shared/enums/enums';
import { PrebudgetPlan } from './prebudget-plan.entity';
import { BudgetYearCodeType } from '../../shared/types/types';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity({ name: 'plan_initiations' })
export class PlanInitiation extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column()
  organizationName: string;

  @Column()
  planName: string;

  @Column({ type: 'jsonb' })
  budgetYear: BudgetYearCodeType;

  @Column()
  budgetYearId: string;

  @Column({
    type: 'enum',
    enum: PlanInitiationStatus,
    default: PlanInitiationStatus.Initaited,
  })
  status: string;

  @Column()
  description: string;

  @Column()
  initiatorName: string;

  @OneToOne(() => PrebudgetPlan, (entity) => entity.planInitiation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  prebudgetPlan: PrebudgetPlan;
}
