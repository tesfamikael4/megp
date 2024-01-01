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
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'instances' })
export class Instance extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.instance)
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

  @Column()
  itemName: string;

  @Column('uuid')
  itemId: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'jsonb' })
  metadata: any[];
}
