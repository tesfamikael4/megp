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
import { OrgAudit } from 'megp-shared-be';
import { State } from './state.entity';
import { InstanceStep } from './instance-step.entity';

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
  instanceStepId: string;

  @ManyToOne(() => InstanceStep, (instanceStep) => instanceStep.instances, {
    cascade: true,
  })
  @JoinColumn({ name: 'instanceStepId' })
  public instanceStep: InstanceStep;

  @Column()
  stateId: string;

  @OneToOne(() => State, (state) => state.instance)
  @JoinColumn()
  state: State;

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
