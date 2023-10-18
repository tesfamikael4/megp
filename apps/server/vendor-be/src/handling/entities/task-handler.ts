import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance';
import { TaskEntity } from 'src/bpm/entities/task.entity';
import { Audit } from 'src/shared/entities/audit.entity';

@Entity({ name: 'task_handlers' })
export class TaskHandlerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column()
  instanceId: string;
  @Column({ nullable: true })
  handlerUserId: string;
  @Column({ nullable: true })
  handlerName: string;
  @Column({ nullable: true })
  previousHandlerId: string;
  @Column({ nullable: true })
  pickedAt: Date;
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: object;
  @Column()
  currentState: string;
  @Column()
  assignmentStatus: string;
  @Column({ nullable: true })
  executedAt: Date;
  @OneToOne(() => WorkflowInstanceEntity, (wfi) => wfi.taskHandler)
  @JoinColumn({ name: 'instanceId' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task.taskHandlers)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
