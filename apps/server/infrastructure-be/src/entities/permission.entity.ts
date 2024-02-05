import { OrgAudit } from '@megp/shared-be';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity({ name: 'permissions' })
export class Permission extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  permissionId: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.permissions)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;
}
