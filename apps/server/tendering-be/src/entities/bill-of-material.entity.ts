import { Audit } from 'src/shared/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Item } from '.';

@Entity({ name: 'bill_of_materials' })
export class BillOfMaterial extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.billOfMaterials)
  @JoinColumn()
  item: Item;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.child)
  @JoinColumn()
  parent: BillOfMaterial;

  @OneToOne(() => BillOfMaterial, (billOfMaterial) => billOfMaterial.child)
  child: BillOfMaterial;

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
