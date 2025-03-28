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
import { DefaultStep } from './default-step.entity';
import { State } from './state.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';

@Entity({ name: 'activities' })
export class Activity extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.activity)
  @JoinColumn({ name: 'workflowId' })
  public workflow: Workflow;

  @OneToMany(() => Step, (step) => step.activity)
  steps: Step[];

  @OneToMany(() => State, (state) => state.activity)
  states: State[];

  @OneToMany(() => DefaultStep, (defaultStep) => defaultStep.activity)
  defaultSteps: DefaultStep[];

  @OneToOne(() => Permission, (permission) => permission.activity, {
    cascade: true,
  })
  permissions: Permission;

  @OneToMany(() => Instance, (instance) => instance.activity, {
    cascade: true,
  })
  instance: Instance[];
}
