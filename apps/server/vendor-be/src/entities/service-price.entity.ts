import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BpServiceEntity } from '@entities';
import { Audit } from '@audit';
import { BusinessAreaEntity } from './business-area.entity';
@Entity({ name: 'service_pricing' })
export class ServicePrice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
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

  @ManyToOne(() => BpServiceEntity, (s) => s.prices)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
  @OneToMany(
    () => BusinessAreaEntity,
    (businessArea) => businessArea.servicePrice,
  )
  businessAreas: BusinessAreaEntity[];
}
