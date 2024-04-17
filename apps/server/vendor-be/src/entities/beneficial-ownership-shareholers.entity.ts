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

@Entity({ name: 'beneficial_shareholders' })
export class BeneficialOwnershipShares extends Audit {
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
  @Column({ nullable: true })
  middleName: string;
  @Column({ nullable: true })
  countryOfResidence: string;
  @Column({ nullable: true })
  share: string;
  @Column({ nullable: true })
  votingRights: string;
  @Column({ nullable: true })
  authorityToAppointGov: string;
  @JoinColumn({ name: 'vendorId' })
  @ManyToOne(() => VendorsEntity, (v) => v.beneficialOwnershipShareholders)
  vendor: VendorsEntity;
}
