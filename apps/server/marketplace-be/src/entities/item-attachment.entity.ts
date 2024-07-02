import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'item_attachments' })
export class ItemAttachment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column()
  title: string;

  @ManyToOne(() => POItem, (poItem) => poItem.itemAttachments)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
}
