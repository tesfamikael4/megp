import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_invitees' })
export class TenderInvitee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.tenderInvitees)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

  @Column()
  bidderId: string;

  @Column()
  bidderName: string;

  @Column()
  status: string;
}
