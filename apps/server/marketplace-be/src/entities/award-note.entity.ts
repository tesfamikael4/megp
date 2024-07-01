import { Audit, OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { AwardItem } from './award-item.entity';

@Entity({ name: 'award_notes' })
export class AwardNote extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxId: string;

  @OneToOne(() => RFX, (rfx) => rfx.awardNote)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  name: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  prId: string;

  @ManyToOne(() => AwardItem, (awardItem) => awardItem.awardNote)
  awardItems: AwardItem[];
}
