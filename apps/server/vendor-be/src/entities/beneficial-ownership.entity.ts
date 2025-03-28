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
  @Column()
  nationality: string;
  @Column({ nullable: true })
  key: string;
  @Column({ nullable: true })
  middleName: string;

  @ManyToOne(() => VendorsEntity, (v) => v.beneficialOwnershipShareholders)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
