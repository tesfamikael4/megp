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
import { EInvitationStatus } from 'src/utils/enums/rfx-invitation.enum';

@Entity({ name: 'rfx_bid_invitations' })
@Unique(['rfxItemId', 'vendorId'])
export class RfxBidInvitation extends Audit {
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

  @ManyToOne(() => RFXItem, (item) => item.bidInvitations)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
