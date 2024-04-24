import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { ItemTag } from './item-tag.entity';
import { UnitOfMeasurement } from './uom.entity';
import { Audit } from 'src/shared/entities';
import { ItemMetaData } from './item-meta-data.entity';
import { ItemSubCategory } from './item-sub-category.entity';

@Entity({ name: 'item_masters' })
export class ItemMaster extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemCode: string;

  @Column()
  description: string;

  @Column()
  commodityCode: string;

  @Column()
  commodityName: string;

  @Column({ type: 'uuid' })
  uOMId: string;

  @Column()
  measurementId: string;

  @Column()
  uOMName: string;

  @Column()
  itemSubCategoryId: string;

  @Column()
  itemCategoryId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ItemTag, (itemTag) => itemTag.itemMaster, {
    cascade: true,
  })
  itemTags: ItemTag[];

  @OneToMany(() => ItemMetaData, (itemMetaData) => itemMetaData.itemMaster, {
    cascade: true,
  })
  itemMetaData: ItemMetaData[];

  @ManyToOne(() => ItemCategory, (itemCategory) => itemCategory.itemMasters)
  @JoinColumn({ name: 'itemCategoryId' })
  itemCategory: ItemCategory;

  @ManyToOne(
    () => ItemSubCategory,
    (itemSubCategory) => itemSubCategory.itemMaster,
  )
  @JoinColumn({ name: 'itemSubCategoryId' })
  itemSubCategory: ItemSubCategory;

  // @ManyToOne(() => Classification)
  // @JoinColumn({ name: 'commodityCode' })
  // commodity: Classification;

  @ManyToOne(() => UnitOfMeasurement)
  @JoinColumn({ name: 'uOMId' })
  uom: UnitOfMeasurement;
}
