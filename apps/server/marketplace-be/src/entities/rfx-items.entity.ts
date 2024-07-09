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
import {
  AwardItem,
  EvalItemResponse,
  OpenedItemResponse,
  OpenedOffer,
  RFX,
  RfxItemDocument,
  RfxProductInvitation,
  RfxTechnicalRequirement,
  SolItemResponse,
  SolOffer,
  SolRoundAward,
  EvalApprovalDetail,
} from '.';
import { ERfxItemStatus } from 'src/utils/enums';

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

  @Column({ type: 'numeric', default: 0 })
  estimatedPrice: number;

  @Column()
  estimatedPriceCurrency: string;

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

  @OneToMany(() => AwardItem, (awardItem) => awardItem.rfxItem)
  awardItem: AwardItem;
  @OneToMany(
    () => EvalApprovalDetail,
    (evalApprovalDetail) => evalApprovalDetail.rfxItem,
  )
  evalApprovalDetails: EvalApprovalDetail[];
}
