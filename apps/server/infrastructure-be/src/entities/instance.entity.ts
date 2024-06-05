import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Activity } from './activity.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';
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

  @ManyToOne(() => InstanceStep, (instanceStep) => instanceStep.instances)
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
