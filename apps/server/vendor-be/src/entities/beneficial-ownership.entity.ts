import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Audit } from '@audit';

@Entity({ name: 'beneficial_ownership' })
export class BeneficialOwnership extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column()
  nationality: string;
  @Column({ nullable: true })
  key: string;
  @JoinColumn({ name: 'vendorId' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
