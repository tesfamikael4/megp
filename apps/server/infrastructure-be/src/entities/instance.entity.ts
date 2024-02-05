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
import { Step } from './step.entity';
import { OrgAudit } from '@megp/shared-be';

@Entity({ name: 'instances' })
export class Instance extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.instance)
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  @Column({ nullable: true })
  stepId: string;

  @ManyToOne(() => Step, (step) => step.instances, {
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
