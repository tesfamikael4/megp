import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';

@Entity({ name: 'workflows' })
export class Workflow extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Activity, (activity) => activity.workflow)
  activity: Activity[];
}
