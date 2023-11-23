import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { Classification } from './classification.entity';
import { ItemTag } from './item-tag.entity';
import { UnitOfMeasurement } from './uom.entity';
import { Audit } from 'src/shared/entities';

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
  commodity: Classification;
  @Column()
  commodityName: string;
  @ManyToOne(() => ItemCategory, (entity) => entity.id)
  @JoinColumn({ name: 'itemSubcategoryId' })
  itemSubcategoryId: string;

  itemSubcategory: ItemCategory;

  @Column()
  itemSubcategoryName: string;

  @ManyToOne(() => UnitOfMeasurement, (entity) => entity.id)
  @JoinColumn({ name: 'uOMId' })
  @Column()
  uOMId: string;
  uom: UnitOfMeasurement;
  @Column()
  measurementId: string;
  @Column()
  uOMName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ItemTag, (entity) => entity.itemMaster, {
    cascade: ['insert', 'update'],
  })
  itemTags: ItemTag[];
}
