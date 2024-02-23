import { Audit } from 'src/shared/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
// import { Item } from './item.entity';

@Entity({ name: 'sor_bill_of_materials' })
export class SorBillOfMaterial extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  // @ManyToOne(() => Item, (item) => item.billOfMaterials)
  // @JoinColumn({ name: 'itemId' })
  // item: Item;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @OneToOne(() => SorBillOfMaterial, (billOfMaterial) => billOfMaterial.child)
  @JoinColumn({ name: 'parentId' })
  parent: SorBillOfMaterial;

  @OneToOne(() => SorBillOfMaterial, (billOfMaterial) => billOfMaterial.child)
  child: SorBillOfMaterial;

  @Column()
  payItem: string;

  @Column()
  description: string;

  @Column()
  unit: string;

  @Column()
  quantity: number;

  @Column()
  rate: number;

  @Column()
  amount: number;
}
