import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BpServiceEntity } from './bp-service.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'preferential_treatments' })
export class PreferentialTreatmentsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  serviceId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ default: 'Submitted' })
  status: string;

  @Column({ nullable: true })
  certificateUrl: string;
  @Column()
  certiNumber: string;
  @ManyToOne(() => BpServiceEntity, (service) => service.prerentials)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
}
