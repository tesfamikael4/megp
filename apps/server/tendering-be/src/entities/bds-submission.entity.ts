import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { EnvelopTypeEnum } from 'src/shared/enums';

@Entity({ name: 'bds_submissions' })
export class BdsSubmission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.bdsSubmission)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'timestamptz' })
  submissionDeadline: Date;

  @Column({ type: 'timestamptz' })
  openingDate: Date;

  @Column({ type: 'timestamptz' })
  invitationDate: Date;

  @Column({
    type: 'enum',
    enum: EnvelopTypeEnum,
  })
  envelopType: string;
}
