import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import { ServicePrice } from 'src/entities/service-price.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { BusinessAreaEntity } from './business-area.entity';
@Entity({ name: 'bp_services' })
export class BpServiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  businessAreaId: string;
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

  @OneToOne(
    () => BusinessAreaEntity,
    (businessArea) => businessArea.BpService,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'businessAreaId' })
  businessArea: BusinessAreaEntity[];
}
