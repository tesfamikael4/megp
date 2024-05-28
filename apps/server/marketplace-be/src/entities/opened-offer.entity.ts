import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { SolRound } from './sol-round.entity';
import { RfxProductInvitation } from './rfx-product-invitation.entity';
import { ESolOfferStatus } from 'src/utils/enums';
import { SolRegistration } from './sol-registration.entity';
import { SolOffer } from './sol-offer.entity';

@Entity({ name: 'opened_offers' })
@Unique(['rfxItemId', 'vendorId', 'solRoundId', 'rfxProductInvitationId'])
export class OpenedOffer extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: ESolOfferStatus,
    default: ESolOfferStatus.PENDING,
  })
  status: ESolOfferStatus;

  // Foreign keys
  @Column('uuid')
  solRoundId: string;

  @Column('uuid')
  rfxProductInvitationId: string;

  @Column('uuid')
  rfxItemId: string;

  @Column('uuid')
  solOfferId: string;

  @Column('uuid')
  solRegistrationId: string;

  // Relations
  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.openedOffers)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @OneToOne(() => SolOffer, (solOffer) => solOffer.openedOffer)
  @JoinColumn({ name: 'solOfferId' })
  solOffer: SolOffer;

  @ManyToOne(() => SolRound, (round) => round.openedOffers)
  @JoinColumn({ name: 'solRoundId' })
  solRound: SolRound;

  @ManyToOne(() => RfxProductInvitation, (round) => round.openedOffers)
  @JoinColumn({ name: 'rfxProductInvitationId' })
  rfxProductInvitation: RfxProductInvitation;

  @ManyToOne(
    () => SolRegistration,
    (registrations) => registrations.openedOffers,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
