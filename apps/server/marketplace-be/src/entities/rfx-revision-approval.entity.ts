import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { ERfxRevisionApprovalStatusEnum } from 'src/utils/enums';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'rfx_revision_approvals' })
export class RfxRevisionApproval extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.revisionApprovals)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: ERfxRevisionApprovalStatusEnum,
    default: ERfxRevisionApprovalStatusEnum.APPROVED,
  })
  status: string;
}
