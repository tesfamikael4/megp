import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Activity } from './activity.entity';
import { Step } from './step.entity';

@Entity({ name: 'instances' })
export class Instance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @OneToOne(() => Activity, (activity) => activity.instance)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  @Column()
  stepId: string;

  @OneToOne(() => Step, (step) => step.instance, {
    cascade: true,
  })
  @JoinColumn({ name: 'stepId' })
  public step: Step;

  @Column()
  status: string;
}
