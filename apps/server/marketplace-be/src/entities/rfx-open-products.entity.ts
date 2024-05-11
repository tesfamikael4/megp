import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { ERfxOpenProductsStatus } from 'src/utils/enums/rfx-open-products.enum';

@Entity({ name: 'rfx_open_products' })
@Unique(['rfxItemId', 'vendorId'])
export class RfxOpenProduct extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxItemId: string;

  @Column({ type: 'jsonb' })
  catalogueSpecificationValues: any;

  @Column({ type: 'jsonb', nullable: true })
  catalogueImages: any[];

  @Column({ type: 'jsonb' })
  catalogueDeliveryValues: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'jsonb' })
  vendorMetadata: any;

  @Column({
    type: 'enum',
    enum: ERfxOpenProductsStatus,
    default: ERfxOpenProductsStatus.DRAFT,
  })
  status: ERfxOpenProductsStatus;

  @ManyToOne(() => RFXItem, (item) => item.openProducts)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
