import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance';
import { TaskEntity } from 'src/bpm/entities/task.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import { TaskCkeckListDto } from 'src/bpm/dtos/task-ckeck-list.dto';
import { JSONObject } from 'supertokens-node/lib/build/types';

@Entity({ name: 'task_trackers' })
export class TaskTrackerEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column()
  instanceId: string;
  @Column({ type: 'jsonb', nullable: true })
  data: object;
  @Column({ nullable: true })
  handlerUserId: string;
  @Column({ nullable: true })
  handlerName: string;
  @Column({ nullable: true })
  pickedAt: Date;
  @Column()
  action: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true })
  previousHandlerId: string;
  @Column({ type: 'jsonb', nullable: true })
  checklists: string;
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  executedAt: string;
  @ManyToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskTrackers,
  )
  @JoinColumn({ name: 'instanceId' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
