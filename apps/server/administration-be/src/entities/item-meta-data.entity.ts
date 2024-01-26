import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemMaster } from './item-master.entity';

@Entity({ name: 'item_meta_data' })
export class ItemMetaData extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  itemMasterId: string;

  @ManyToOne(() => ItemMaster, (itemMaster) => itemMaster.itemMetaData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  itemMaster: ItemMaster;
}
