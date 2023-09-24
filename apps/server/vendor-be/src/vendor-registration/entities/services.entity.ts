import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ServicePriceEntity } from './service-price.entity';
@Entity({ name: 'services' })
export class ServicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ApplicationEntity, (app) => app.service)
  applications: ApplicationEntity[];

  @OneToMany(() => ServicePriceEntity, (prc) => prc.service)
  priceSettings: ServicePriceEntity[];
}
