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
import {
  AwardItem,
  RFXItem,
  RfxProductInvitation,
  SolOffer,
  SolRegistration,
  SolRound,
  SolRoundAward,
} from '.';
import { ESolOfferStatus } from 'src/utils/enums';

@Entity({ name: 'opened_offers' })
@Unique(['rfxItemId', 'vendorId', 'solRoundId', 'rfxProductInvitationId'])
export class OpenedOffer extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'numeric' })
  tax: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ type: 'numeric' })
  calculatedPrice: number;

  @Column({
    type: 'enum',
    enum: ESolOfferStatus,
    default: ESolOfferStatus.PENDING,
  })
  status: ESolOfferStatus;

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.openedOffers)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solOfferId: string;

  @OneToOne(() => SolOffer, (solOffer) => solOffer.openedOffer)
  @JoinColumn({ name: 'solOfferId' })
  solOffer: SolOffer;

  @Column('uuid')
  solRoundId: string;

  @ManyToOne(() => SolRound, (round) => round.openedOffers)
  @JoinColumn({ name: 'solRoundId' })
  solRound: SolRound;

  @Column('uuid')
  rfxProductInvitationId: string;

  @ManyToOne(() => RfxProductInvitation, (round) => round.openedOffers)
  @JoinColumn({ name: 'rfxProductInvitationId' })
  rfxProductInvitation: RfxProductInvitation;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (registrations) => registrations.openedOffers,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @OneToOne(() => SolRoundAward, (roundAward) => roundAward.openedOffer)
  solRoundAwards: SolRoundAward[];

  @OneToOne(() => AwardItem, (awardItem) => awardItem.openedOffer)
  awardItem: AwardItem;
}
