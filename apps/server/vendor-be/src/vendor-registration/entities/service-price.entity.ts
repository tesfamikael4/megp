import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from 'src/bpm/workflow-instances/entities/workflow-instance';
import { BpServiceEntity } from 'src/bpm/services/entities/bp-service';
@Entity({ name: 'service_pricing' })
export class ServicePriceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid', name: 'serviceId' })
  serviceId: string;
  @Column({ name: 'businessArea', enum: ['Goods', 'Services', 'Works'] })
  businessArea: string;
  @Column({ type: 'decimal' })
  valueFrom: number;
  @Column({ type: 'decimal' })
  valueTo: number;
  @Column({ type: 'decimal', name: 'fee' })
  fee: number;
  @Column({ name: 'currency' })
  currency: string;
  @OneToMany(() => WorkflowInstanceEntity, (app) => app.price)
  workflowInstances: WorkflowInstanceEntity[];
  @ManyToOne(() => BpServiceEntity, (s) => s.prices)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
}
