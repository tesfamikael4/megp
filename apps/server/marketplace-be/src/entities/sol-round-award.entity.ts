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
import { SolOffer } from './sol-offer.entity';
import { OpenedOffer } from './opened-offer.entity';

@Entity({ name: 'sol_round_awards' })
@Unique(['rfxItemId', 'solRoundId'])
export class SolRoundAward extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  winnerPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  nextRoundStartingPrice: number;

  @Column({ type: 'uuid' })
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.solRoundAwards)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solRoundId: string;

  @ManyToOne(() => SolRound, (round) => round.solRoundAwards)
  @JoinColumn({ name: 'solRoundId' })
  solRound: SolRound;

  @Column('uuid')
  rfxProductInvitationId: string;

  @ManyToOne(
    () => RfxProductInvitation,
    (registrations) => registrations.solRoundAwards,
  )
  @JoinColumn({ name: 'rfxProductInvitationId' })
  rfxProductInvitation: RfxProductInvitation;

  @Column('uuid')
  solOfferId: string;

  @OneToOne(() => SolOffer, (registrations) => registrations.solRoundAwards)
  @JoinColumn({ name: 'solOfferId' })
  solOffer: SolOffer;

  @Column('uuid')
  openedOfferId: string;

  @OneToOne(() => OpenedOffer, (registrations) => registrations.solRoundAwards)
  @JoinColumn({ name: 'openedOfferId' })
  openedOffer: OpenedOffer;
}
