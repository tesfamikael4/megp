import { BusinessProcessEntity } from 'src/bpm/entities/business-process';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskAssignmentEntity } from '../../handling/entities/task-assignment';
import { TaskHandlerEntity } from 'src/handling/entities/task-handler';
import { CreateTaskCheckListDto } from '../dtos/task-check-list.dto';
@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  label: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column()
  bpId: string;
  @Column()
  handlerType: string;
  @Column()
  taskType: string;
  @Column({ type: 'jsonb', nullable: true })
  checkList: CreateTaskCheckListDto[];
  @ManyToOne(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.tasks,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'bpId' })
  businessProcess: BusinessProcessEntity;
  @OneToMany(
    () => TaskAssignmentEntity,
    (taskAssignment) => taskAssignment.task,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  assignments: TaskAssignmentEntity[];

  @OneToMany(() => TaskHandlerEntity, (taskHandler) => taskHandler.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  taskHandlers: TaskHandlerEntity[];
}
