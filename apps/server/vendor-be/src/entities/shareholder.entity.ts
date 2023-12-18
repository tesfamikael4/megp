import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Audit } from 'src/shared/entities/audit.entity';
@Entity({ name: 'shareholders' })
export class ShareholdersEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ default: 'Malian' })
  nationality: string;
  @Column()
  share: string;
  @JoinColumn({ name: 'vendorId' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
