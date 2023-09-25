import { BusinessProcessEntity } from 'src/bpm/business-process/entities/business-process';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { ServicePriceEntity } from 'src/vendor-registration/entities/service-price.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'bp_services' })
export class BpServiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'key', unique: true })
  key: string;
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.service,
    {
      // cascade: true,
      onDelete: 'CASCADE',
    },
  )
  businessProcesses: BusinessProcessEntity[];
  @OneToMany(() => ServicePriceEntity, (service) => service.service, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  prices: ServicePriceEntity[];
}
