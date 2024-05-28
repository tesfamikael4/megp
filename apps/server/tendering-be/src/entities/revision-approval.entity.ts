import { Audit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Tender } from './tender.entity';
import { RevisionApprovalStatusEnum } from 'src/shared/enums';

@Entity({ name: 'revision_approvals' })
@Unique(['tenderId', 'userId'])
export class RevisionApproval extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.revisionApprovals)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: RevisionApprovalStatusEnum,
    default: RevisionApprovalStatusEnum.APPROVED,
  })
  status: string;
}
