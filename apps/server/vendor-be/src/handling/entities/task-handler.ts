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

@Entity({ name: 'task_handlers' })
export class TaskHandlerEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column()
  instanceId: string;
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: object;
  @Column()
  assignmentStatus: string;
  @Column({ nullable: true })
  previousHandlerId: string;
  @Column()
  @Column()
  currentState: string;
  @OneToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskHandler,
  ) // specify inverse side as a second parameter
  @JoinColumn({ name: 'instanceId' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
