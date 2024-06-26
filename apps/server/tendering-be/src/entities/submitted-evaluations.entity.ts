import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'submitted_evaluations' })
export class SubmittedEvaluation extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  plan: any;

  @Column()
  objectType: string;

  @Column({ type: 'uuid' })
  objectId: string;

  @Column()
  version: number;
}
