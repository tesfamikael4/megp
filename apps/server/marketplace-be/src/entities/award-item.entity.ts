import { Audit, OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AwardNote, OpenedOffer, RFXItem, SolRegistration } from '.';
import { EAwardItemStatus } from 'src/utils/enums/award.enum';

@Entity({ name: 'award_items' })
export class AwardItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({ type: 'numeric' })
  calculatedPrice: number;

  @Column({
    type: 'enum',
    enum: EAwardItemStatus,
    default: EAwardItemStatus.PENDING,
  })
  status: EAwardItemStatus;

  @Column('uuid')
  awardNoteId: string;

  @ManyToOne(() => AwardNote, (awardNote) => awardNote.awardItems)
  @JoinColumn({ name: 'awardNoteId' })
  awardNote: AwardNote;

  @Column({ type: 'uuid' })
  rfxItemId: string;

  @OneToOne(() => RFXItem, (rfx) => rfx.awardItem)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(() => SolRegistration, (registration) => registration.awardItems)
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @Column('uuid')
  openedOfferId: string;

  @OneToOne(() => OpenedOffer, (openedOffer) => openedOffer.awardItem)
  @JoinColumn({ name: 'openedOfferId' })
  openedOffer: OpenedOffer;
}
