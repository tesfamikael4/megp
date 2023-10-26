import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Measurement } from './measurement.entity';
import { ItemMaster } from './item-master.entity';
@Entity({ name: 'item_categories' })
export class ItemCategory extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  parentId: string;
  //self rererencing
  @ManyToOne(() => ItemCategory, (icategory) => icategory.childCategories)
  parentICategory: ItemCategory;
  @OneToMany(() => ItemCategory, (icategory) => icategory.parentICategory)
  childCategories: ItemCategory[];
  @OneToOne(() => Measurement, (icategory) => icategory.itemCategory)
  measurement: ItemCategory;
  @OneToMany(() => ItemMaster, (entity) => entity.itemSubcategory)
  itemMasters: ItemMaster[];
}
