import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ServicesEntity } from './services.entity';
@Entity({ name: 'servicePricing' })
export class ServicePriceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'serviceId', type: 'uuid' })
  serviceId: string;
  @Column({ name: 'businessArea', enum: ['Goods', 'Services', 'Works'] })
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
  @ManyToOne(() => ServicesEntity, (s) => s.priceSettings)
  @JoinColumn({ name: 'serviceId' })
  service: ServicesEntity;
}
