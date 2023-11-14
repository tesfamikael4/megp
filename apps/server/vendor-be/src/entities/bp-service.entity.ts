import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import { ServicePrice } from 'src/entities/service-price.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'bp_services' })
export class BpServiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'key', unique: true })
  key: string;
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
  @Column({ default: true })
  isActive: boolean;

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
