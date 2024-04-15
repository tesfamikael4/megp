import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemMaster } from './item-master.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'item_categories' })
export class ItemCategory extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  parentId: string;

  // Self-referencing parent category
  @ManyToOne(() => ItemCategory, (icategory) => icategory.childCategories)
  parentICategory: ItemCategory;

  // Self-referencing child categories
  @OneToMany(() => ItemCategory, (icategory) => icategory.parentICategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  childCategories: ItemCategory[];

  @OneToMany(() => ItemMaster, (itemMaster) => itemMaster.itemSubcategory)
  itemMasters: ItemMaster[];
}
