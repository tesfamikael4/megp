import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ServicePriceEntity } from './service-price.entity';
@Entity({ name: 'services' })
export class ServicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  key: string;
  @Column()
  description: string;
  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => ApplicationEntity, (app) => app.service)
  applications: ApplicationEntity[];
  @OneToMany(() => ServicePriceEntity, (prc) => prc.service)
  priceSettings: ServicePriceEntity[];
}
