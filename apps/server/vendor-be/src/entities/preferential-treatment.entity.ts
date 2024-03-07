import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BpServiceEntity } from './bp-service.entity';
import { VendorsEntity } from './vendors.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'preferential_treatments' })
export class PreferentialTreatmentsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @Column({ type: 'uuid' })
  serviceId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ default: 'Submitted' })
  status: string;
  // @Column({ nullable: true })
  // remark: string;
  // @Column({ type: 'jsonb', nullable: true })
  // extendedProfile: any;
  @Column({ nullable: true })
  certificateUrl: string;
  @Column()
  certiNumber: string;
  // @Column({ type: 'jsonb', nullable: true })
  // otherDocuments: any;
  @ManyToOne(() => VendorsEntity, (vendor) => vendor.preferentials)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
  @ManyToOne(() => BpServiceEntity, (service) => service.prerentials)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
}
