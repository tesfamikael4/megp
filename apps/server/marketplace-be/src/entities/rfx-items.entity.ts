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
import { RfxProductInvitation } from './rfx-product-invitation.entity';
import { RfxItemDocument } from './rfx-item-document.entity';
import { SolOffer } from './sol-offer.entity';
import { SolItemResponse } from './sol-item-response.entity';
import { OpenedItemResponse } from './opened-item-response.entity';
import { OpenedOffer } from './opened-offer.entity';
import { EvalItemResponse } from './eval-item-response.entity';
import { SolRoundAward } from './sol-round-award.entity';

@Entity({ name: 'rfx_items' })
export class RFXItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ nullable: true })
  warrantyPeriod: number;

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

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.items)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToOne(
    () => RfxTechnicalRequirement,
    (RfxTechnicalRequirement) => RfxTechnicalRequirement.rfxItem,
  )
  technicalRequirement: RfxTechnicalRequirement;

  @OneToMany(
    () => RfxProductInvitation,
    (rfxProductInvitation) => rfxProductInvitation.rfxItem,
  )
  rfxProductInvitations: RfxProductInvitation[];

  @OneToOne(() => RfxItemDocument, (rfxDocument) => rfxDocument.rfxItem)
  rfxItemDocuments: RfxItemDocument;

  @OneToMany(() => SolOffer, (offer) => offer.rfxItem)
  solOffers: SolOffer[];

  @OneToMany(() => OpenedOffer, (offer) => offer.rfxItem)
  openedOffers: OpenedOffer[];

  @OneToMany(
    () => OpenedItemResponse,
    (rfxItemResponse) => rfxItemResponse.rfxItem,
  )
  openedItemResponses: OpenedItemResponse[];

  @OneToMany(
    () => SolItemResponse,
    (rfxItemResponse) => rfxItemResponse.rfxItem,
  )
  solItemResponses: SolItemResponse[];

  @OneToMany(
    () => EvalItemResponse,
    (rfxItemResponse) => rfxItemResponse.rfxItem,
  )
  evalItemResponses: EvalItemResponse[];

  @OneToMany(() => SolRoundAward, (roundAward) => roundAward.rfxItem)
  solRoundAwards: SolRoundAward[];
}
