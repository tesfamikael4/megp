import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ItemMaster } from './item-master.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'item_tags' })
export class ItemTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemMasterId: string;

  @ManyToOne(() => ItemMaster, (e) => e.itemTags)
  @JoinColumn({ name: 'itemMasterId' })
  itemMaster: ItemMaster;

  @Column()
  tagId: string;

  @ManyToOne(() => Tag, (e) => e.itemTags)
  @JoinColumn({ name: 'tagId' })
  tag: Tag;
}
