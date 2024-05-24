import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { EInvitationStatus } from 'src/utils/enums/rfx.enum';
import { SolOffer } from './sol-offer.entity';

@Entity({ name: 'rfx_product_invitations' })
export class RfxProductInvitation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxItemId: string;

  @Column()
  productCatalogueId: string;

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
    enum: EInvitationStatus,
    default: EInvitationStatus.DRAFT,
  })
  status: EInvitationStatus;

  @OneToMany(() => SolOffer, (offer) => offer.rfxBidnvitation)
  solOffers: SolOffer[];

  @ManyToOne(() => RFXItem, (item) => item.rfxProductInvitations)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
