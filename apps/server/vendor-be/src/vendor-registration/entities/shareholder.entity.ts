import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { VendorsEntity } from './vendors.entity';
@Entity({ name: 'shareholders' })
export class ShareholdersEntity extends CommonEntity {
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
  @Column({ nullable: true })
  key: string;
  @JoinColumn({ name: 'vendorId' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
