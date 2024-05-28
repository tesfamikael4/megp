import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EInvitationStatus } from 'src/utils/enums/rfx.enum';
import { EvalItemResponse, OpenedOffer, RFXItem, SolOffer } from '.';

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

  @OneToMany(() => SolOffer, (offer) => offer.rfxProductInvitation)
  solOffers: SolOffer[];

  @OneToMany(() => OpenedOffer, (offer) => offer.rfxProductInvitation)
  openedOffers: OpenedOffer[];

  @ManyToOne(() => RFXItem, (item) => item.rfxProductInvitations)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @OneToMany(
    () => EvalItemResponse,
    (evaluation) => evaluation.rfxProductInvitation,
  )
  evalItemResponses: EvalItemResponse[];
}
