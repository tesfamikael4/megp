import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'bds_submissions' })
export class BdsSubmission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.bdsSubmission)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'date' })
  submissionDeadline: Date;

  @Column({ type: 'date' })
  openingDate: Date;

  @Column({ type: 'date' })
  invitationDate: Date;

  @Column()
  envelopType: string;
}
