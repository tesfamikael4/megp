import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { SolRound } from './sol-round.entity';
import { RfxBidInvitation } from './rfx-bid-invitation.entity';
import { ESolOfferStatus } from 'src/utils/enums';
import { SolRegistration } from './sol-registration.entity';

@Entity({ name: 'sol_offers' })
@Unique(['rfxItemId', 'vendorId', 'round', 'invitationId'])
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
  price: string;

  @Column()
  roundId: string;

  @Column()
  invitationId: string;

  // @Column()
  // registrationId: string;

  @Column({
    type: 'enum',
    enum: ESolOfferStatus,
    default: ESolOfferStatus.PENDING,
  })
  status: ESolOfferStatus;

  @ManyToOne(() => SolRound, (round) => round.offers)
  @JoinColumn({ name: 'roundId' })
  round: SolRound;

  @ManyToOne(() => RfxBidInvitation, (round) => round.offers)
  @JoinColumn({ name: 'invitationId' })
  invitation: RfxBidInvitation;

  // @ManyToOne(() => SolRegistration, registrations => registrations.offers)
  // @JoinColumn({ name: 'registrationId' })
  // registration: SolRegistration;
}
