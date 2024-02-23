import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_documents' })
export class SorDocument extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  attachment: any;

  @ManyToOne(() => Item, (item) => item.documents)
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
