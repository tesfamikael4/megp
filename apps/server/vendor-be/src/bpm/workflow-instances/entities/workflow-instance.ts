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
import { VendorsEntity } from 'src/vendor-registration/entities/vendors.entity';
import { ServicePriceEntity } from 'src/vendor-registration/entities/service-price.entity';

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
  @Column({ name: 'pricing_id', nullable: true })
  pricingId: string;
  @Column({ name: 'approved_at', nullable: true })
  approved_at: string;
  @Column({ name: 'expire_date', nullable: true })
  expire_date: string;
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

  @ManyToOne(() => ServicePriceEntity, (price) => price.workflowInstances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pricing_id' })
  price: ServicePriceEntity;

  @ManyToOne(() => VendorsEntity, (v) => v.instances)
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
