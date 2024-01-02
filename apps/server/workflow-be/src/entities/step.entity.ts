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
import { OrgAudit } from 'src/shared/entities';

type approver = {
  id: string;
  approver: string;
  approverType: string;
  approvalMethod: string;
};

@Entity({ name: 'steps' })
export class Step extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.steps)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  @OneToMany(() => Instance, (instance) => instance.step)
  instances: Instance[];

  @Column({ type: 'jsonb' })
  approvers: approver[];

  @Column()
  type: string;

  @Column()
  order: number;
}
