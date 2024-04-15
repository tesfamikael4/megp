import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'submitted_plans' })
export class SubmittedPlan extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  plan: any;

  @Column()
  objectType: string;
}
