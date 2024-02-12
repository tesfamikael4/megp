import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Activity } from './activity.entity';
import { Instance } from './instance.entity';
import { OrgAudit } from 'megp-shared-be';

type approver = {
  id: string;
  approverName: string;
  approvalType: string;
  approvalMethod: string;
};

@Entity({ name: 'default_steps' })
export class DefaultStep extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.steps)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  @Column({ default: 'default' })
  type: string;

  @Column()
  order: number;
}
