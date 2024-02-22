import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'submissions' })
export class Submission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.submission)
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
