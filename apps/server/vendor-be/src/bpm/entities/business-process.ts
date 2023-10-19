import { BpServiceEntity } from 'src/services/entities/bp-service';
import { TaskEntity } from 'src/bpm/entities/task.entity';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities/audit.entity';

@Entity({ name: 'business_processes' })
export class BusinessProcessEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  serviceId: string;
  @Column({ type: 'jsonb' })
  workflow: object;
  @Column({ type: 'int' })
  version: number;
  @Column({ default: true })
  isActive: boolean;
  @Column({ nullable: true })
  organizationId: string;
  @Column({ nullable: true })
  organizationName: string;
  @ManyToOne(() => BpServiceEntity, (service) => service.businessProcesses, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
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
