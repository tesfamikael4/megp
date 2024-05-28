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
import { OpenedOffer } from './opened-offer.entity';

@Entity({ name: 'sol_offers' })
@Unique(['rfxItemId', 'vendorId', 'solRoundId', 'rfxProductInvitationId'])
export class SolOffer extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.solOffers)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column()
  vendorId: string;

  @Column()
  encryptedPrice: string;

  @Column()
  solRoundId: string;

  @Column()
  rfxProductInvitationId: string;

  @Column()
  solRegistrationId: string;

  @Column({
    type: 'enum',
    enum: ESolOfferStatus,
    default: ESolOfferStatus.PENDING,
  })
  status: ESolOfferStatus;

  @OneToOne(() => OpenedOffer, (openedOffer) => openedOffer.solOffer)
  openedOffer: OpenedOffer;

  @ManyToOne(() => SolRound, (round) => round.solOffers)
  @JoinColumn({ name: 'solRoundId' })
  solRound: SolRound;

  @ManyToOne(() => RfxProductInvitation, (round) => round.solOffers)
  @JoinColumn({ name: 'rfxProductInvitationId' })
  rfxProductInvitation: RfxProductInvitation;

  @ManyToOne(() => SolRegistration, (registrations) => registrations.solOffers)
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
