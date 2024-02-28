import { Audit } from 'src/shared/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_bill_of_materials' })
export class SorBillOfMaterial extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.billOfMaterials)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  payItem: string;

  @Column()
  description: string;

  @Column()
  unit: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  rate: number;

  @Column({ nullable: true })
  amount: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  parentCode: string;
}
