import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';

@Entity({ name: 'rfx_item_documents' })
@Unique(['rfxItemId', 'key'])
export class RfxItemDocument extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  fileInfo: any;

  @Column({ nullable: true })
  title: string;

  @Column()
  key: string;

  @Column()
  rfxItemId: string;

  @OneToOne(() => RFXItem, (rfx) => rfx.rfxItemDocuments)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
