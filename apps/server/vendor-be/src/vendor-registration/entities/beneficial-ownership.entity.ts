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

@Entity({ name: 'beneficial_ownership' })
export class BeneficialOwnership extends CommonEntity {
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

  @JoinColumn({ name: 'vendorId' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
