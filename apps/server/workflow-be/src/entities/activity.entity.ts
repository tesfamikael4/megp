import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Step } from './step.entity';
import { Workflow } from './workflow.entity';

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

  @Column({ type: 'jsonb' })
  permission: string[];
}
