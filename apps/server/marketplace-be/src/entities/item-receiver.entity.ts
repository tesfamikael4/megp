import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { Invoice } from './invoice.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'item_receivers' })
export class ItemReceiver extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @ManyToOne(() => POItem, (poItem) => poItem.itemReceivers)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
}
