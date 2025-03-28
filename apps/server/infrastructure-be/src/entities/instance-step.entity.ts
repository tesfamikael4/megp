import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Activity } from './activity.entity';
import { Instance } from './instance.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';

type approver = {
  id: string;
  approver: string;
  approverType: string;
  approvalMethod: string;
};

@Entity({ name: 'instance_steps' })
export class InstanceStep extends OrgAudit {
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

  @OneToMany(() => Instance, (instance) => instance.instanceStep, {
    cascade: false,
  })
  instances: Instance[];

  @Column({ type: 'jsonb' })
  approvers: approver[];

  @Column()
  type: string;

  @Column()
  order: number;

  @Column()
  itemId: string;
}
