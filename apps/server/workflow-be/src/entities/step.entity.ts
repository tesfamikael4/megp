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

type approver = {
  userId: string;
  name: string;
  permission: string[];
};

@Entity({ name: 'steps' })
export class Step {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.steps)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  @OneToOne(() => Instance, (instance) => instance.step)
  instance: Instance;

  @Column({ type: 'simple-array' })
  approvers: approver[];

  @Column({ type: 'simple-array' })
  approvalMethods: approver[];

  @Column({ type: 'simple-array' })
  approverTypes: approver[];

  @Column()
  type: string;

  @Column()
  order: number;
}
