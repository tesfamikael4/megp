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
  //self rererencing
  @ManyToOne(() => ItemCategory, (icategory) => icategory.childCategories)
  parentICategory: ItemCategory;
  @OneToMany(() => ItemCategory, (icategory) => icategory.parentICategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  childCategories: ItemCategory[];
  @OneToMany(() => ItemMaster, (entity) => entity.itemSubcategory)
  itemMasters: ItemMaster[];
}
