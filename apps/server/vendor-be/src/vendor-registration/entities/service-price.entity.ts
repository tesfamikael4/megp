import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
//service_pricing
@Entity({ name: 'service_prices' })
export class ServicePriceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /// services are New , renew, upgrade
  @Column({ name: 'service_id' })
  serviceId: string;
  //business area are Goods Services, Works
  @Column({ name: 'business_area' })
  businessArea: string;

  @Column({ type: 'decimal', name: 'value_from' })
  valueFrom: number;

  @Column({ type: 'decimal', name: 'value_to' })
  valueTo: number;

  @Column({ type: 'decimal', name: 'fee' })
  fee: number;
  @Column({ name: 'currency' })
  currency: string;
  @OneToMany(() => ApplicationEntity, (app) => app.price)
  applications: ApplicationEntity[];
}
