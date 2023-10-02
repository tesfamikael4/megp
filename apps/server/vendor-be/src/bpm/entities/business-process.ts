import { BpServiceEntity } from 'src/services/entities/bp-service';
import { TaskEntity } from 'src/bpm/entities/task.entity';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'business_processes' })
export class BusinessProcessEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'service_id' })
  serviceId: string;
  @Column({ name: 'workflow', type: 'jsonb' })
  workflow: object;
  @Column({ name: 'version', type: 'int' })
  version: number;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
  @Column({ name: 'organization_id', nullable: true })
  organizationId: string;
  @Column({ name: 'organization_name', nullable: true })
  organizationName: string;
  @ManyToOne(() => BpServiceEntity, (service) => service.businessProcesses, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: BpServiceEntity;

  @OneToMany(() => TaskEntity, (task) => task.businessProcess, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: TaskEntity[];

  @OneToMany(
    () => WorkflowInstanceEntity,
    (workflowInstances) => workflowInstances.businessProcess,
    {
      // cascade: true,
      onDelete: 'CASCADE',
    },
  )
  workflowInstances: WorkflowInstanceEntity[];
}
