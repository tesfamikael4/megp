import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Activity } from './activity.entity';

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

  @Column({ type: 'simple-array' })
  approvers: approver[];

  @Column()
  rule: string;

  @Column()
  order: number;
}
