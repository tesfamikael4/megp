import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { RfxTechnicalRequirement } from './rfx-technical-requirement.entity';
import { ERfxItemStatus } from 'src/utils/enums';
import { RfxBidInvitation } from './rfx-bid-invitation.entity';
import { RfxItemDocument } from './rfx-item-document.entity';
import { RfxOpenProduct } from './rfx-open-products.entity';
import { SolOffer } from './sol-offer.entity';
import { SolItemResponse } from './sol-item-response.entity';

@Entity({ name: 'rfx_items' })
export class RFXItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @Column({ default: false })
  isOpen: boolean;

  @Column()
  itemCode: string;

  @Column({ nullable: true })
  itemType: string;

  @Column({ nullable: true })
  procurementCategory: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unitOfMeasure: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedPrice: number;

  @Column()
  estimatedPriceCurrency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice: number;

  @Column({ nullable: true })
  marketPriceCurrency: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({
    type: 'enum',
    enum: ERfxItemStatus,
    default: ERfxItemStatus.DRAFT,
  })
  status: ERfxItemStatus;

  @ManyToOne(() => RFX, (rfx) => rfx.items)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToOne(
    () => RfxTechnicalRequirement,
    (RfxTechnicalRequirement) => RfxTechnicalRequirement.rfxItem,
  )
  technicalRequirement: RfxTechnicalRequirement;

  @OneToMany(
    () => RfxBidInvitation,
    (rfxBidInvitation) => rfxBidInvitation.rfxItem,
  )
  bidInvitations: RfxBidInvitation[];

  @OneToOne(() => RfxItemDocument, (rfxDocument) => rfxDocument.rfxItem)
  rfxItemDocuments: RfxItemDocument;

  @OneToMany(() => RfxOpenProduct, (rfxOpenProducts) => rfxOpenProducts.rfxItem)
  openProducts: RfxOpenProduct[];

  @OneToMany(() => SolOffer, (offer) => offer.rfxItem)
  solOffers: SolOffer[];

  @OneToMany(
    () => SolItemResponse,
    (rfxItemResponse) => rfxItemResponse.rfxItem,
  )
  itemResponses: SolItemResponse[];
}
