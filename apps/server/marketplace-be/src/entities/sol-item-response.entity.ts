import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'sol_response_items' })
@Unique(['rfxItemId', 'vendorId', 'key'])
export class SolItemResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfx) => rfx.itemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column()
  vendorId: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;
}
