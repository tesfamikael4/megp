import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
@Entity({ name: 'annual_procurement_plans' })
export class AnnualProcurementPlan extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  organization: JSON;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  budgetYear: JSON;

  @Column({ default: 'Draft' })
  status: string;
}
