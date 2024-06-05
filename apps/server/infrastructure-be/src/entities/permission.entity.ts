import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Step } from './step.entity';
import { Workflow } from './workflow.entity';
import { Activity } from './activity.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';

@Entity({ name: 'permissions' })
export class Permission extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  permissionId: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.permissions)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;
}
