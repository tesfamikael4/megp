import { BusinessProcessEntity } from 'src/bpm/business-process/entities/business-process';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskHandlerEntity } from './task-handler';
import { TaskTrackerEntity } from './task-tracker';

@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'application_number' })
  applicationNumber: string;
  @Column({ name: 'requestor_id' })
  requestorId: string;
  @Column({ name: 'status' })
  status: string;
  @Column({ name: 'bp_id' })
  bpId: string;
  @ManyToOne(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.workflowInstances,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'bp_id' })
  businessProcess: BusinessProcessEntity;
  // @OneToMany(
  //   () => TaskHandlerEntity,
  //   (taskHandler) => taskHandler.workflowInstance,
  //   {
  //     cascade: true,
  //     onDelete: 'CASCADE',
  //   },
  // )
  // taskHandlers: TaskHandlerEntity[];
  @OneToOne(
    () => TaskHandlerEntity,
    (taskHandler) => taskHandler.workflowInstance,
  ) // specify inverse side as a second parameter
  taskHandler: TaskHandlerEntity;

  @OneToMany(
    () => TaskTrackerEntity,
    (taskTracker) => taskTracker.workflowInstance,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  taskTrackers: TaskTrackerEntity[];
  addTracker(taskTracker: TaskTrackerEntity) {
    if (!this.taskTrackers) {
      this.taskTrackers = [];
    }
    this.taskTrackers.push(taskTracker);
  }
  updateTracker(taskTracker: TaskTrackerEntity) {
    const index = this.taskTrackers.findIndex((a) => a.id === taskTracker.id);
    if (index !== -1) {
      this.taskTrackers[index] = taskTracker;
    }
  }
  removeTracker(taskTracker: TaskTrackerEntity) {
    const index = this.taskTrackers.findIndex((a) => a.id === taskTracker.id);
    if (index !== -1) {
      this.taskTrackers.splice(index, 1);
    }
  }
}
