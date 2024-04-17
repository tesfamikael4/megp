import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BpServiceEntity } from './bp-service.entity';
import { Audit } from '@audit';

@Entity({ name: 'preferential_treatments' })
export class PreferentialTreatmentsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  serviceId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ nullable: true })
  certificateUrl: string;
  @Column()
  certiNumber: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  certificateValidityPeriod: Date;
  @Column({ nullable: true })
  certificateIssuedDate: Date;
  @Column({ default: 'Submitted' })
  status: string;
  @ManyToOne(() => BpServiceEntity, (service) => service.prerentials)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
}
