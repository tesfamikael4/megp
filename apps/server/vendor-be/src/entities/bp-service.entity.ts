import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import { ServicePrice } from 'src/entities/service-price.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
@Entity({ name: 'bp_services' })
export class BpServiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  key: string;
  @Column({ nullable: true })
  description: string;
  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  instances: WorkflowInstanceEntity[];
  @OneToMany(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.service,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  businessProcesses: BusinessProcessEntity[];
  @OneToMany(() => ServicePrice, (price) => price.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  prices: ServicePrice[];
}
