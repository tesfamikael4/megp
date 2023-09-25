import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity({ name: 'beneficialOwnership' })
export class BeneficialOwnership extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ name: 'vendor_id', nullable: true })
  vendorId: string;
  @Column()
  nationality: string;

  @JoinColumn({ name: 'vendor_id' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
