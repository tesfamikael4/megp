import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemMaster } from './item-master.entity';

export enum ParentCategory {
  Goods = 'Goods',
  Service = 'Service',
  Work = 'Work',
}

@Entity({ name: 'item_sub_categories' })
export class ItemSubCategory extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ParentCategory })
  parentCategories: string;

  @OneToMany(() => ItemMaster, (itemMaster) => itemMaster.itemCategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  itemMaster: ItemMaster[];
}
