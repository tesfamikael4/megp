import { BusinessProcessEntity } from 'src/bpm/business-process/entities/business-process';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskHandlerEntity } from './task-handler';
import { TaskTrackerEntity } from './task-tracker';
import { VendorsEntity } from 'src/vendor-registration/entities/vendors.entity';
import { ServicePriceEntity } from 'src/vendor-registration/entities/service-price.entity';

@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'application_no' })
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
  @OneToMany(
    () => TaskHandlerEntity,
    (taskHandler) => taskHandler.workflowInstance,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  taskHandlers: TaskHandlerEntity[];
  addHandler(taskHandler: TaskHandlerEntity) {
    if (!this.taskHandlers) {
      this.taskHandlers = [];
    }
    this.taskHandlers.push(taskHandler);
  }
  updateHandler(taskHandler: TaskHandlerEntity) {
    const index = this.taskHandlers.findIndex((a) => a.id === taskHandler.id);
    if (index !== -1) {
      this.taskHandlers[index] = taskHandler;
    }
  }
  removeHandler(taskHandler: TaskHandlerEntity) {
    const index = this.taskHandlers.findIndex((a) => a.id === taskHandler.id);
    if (index !== -1) {
      this.taskHandlers.splice(index, 1);
    }
  }

  @OneToMany(
    () => TaskTrackerEntity,
    (taskTracker) => taskTracker.workflowInstance,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  taskTrackers: TaskTrackerEntity[];

  @Column({ name: 'pricing_id', nullable: true })
  pricingId: string;
  @ManyToOne(() => ServicePriceEntity, (price) => price.workflowInstances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pricing_id' })
  price: ServicePriceEntity;

  @ManyToOne(() => VendorsEntity, (v) => v.instances, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requestor_id' })
  vendor: VendorsEntity;

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
