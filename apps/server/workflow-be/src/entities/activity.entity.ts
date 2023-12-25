import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Step } from './step.entity';
import { Workflow } from './workflow.entity';
import { Permission } from './permission.entity';
import { Instance } from './instance.entity';
import { DefaultStep } from './defaultStep.entity';

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.activities)
  @JoinColumn({ name: 'workflowId' })
  public workflow: Workflow;

  @OneToMany(() => Step, (step) => step.activity)
  steps: Step[];

  @OneToMany(() => DefaultStep, (defaultStep) => defaultStep.activity)
  defaultSteps: DefaultStep[];

  @OneToOne(() => Permission, (permission) => permission.activity, {
    cascade: true,
  })
  permissions: Permission;

  @OneToOne(() => Instance, (instance) => instance.activity, {
    cascade: true,
  })
  instance: Instance;
}
