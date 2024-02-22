import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '.';

@Entity({ name: 'documents' })
export class Document extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.documents)
  @JoinColumn()
  item: Item;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  attachment: any;
}
