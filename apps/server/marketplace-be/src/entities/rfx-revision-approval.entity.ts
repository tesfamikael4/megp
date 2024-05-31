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
import { RfxProcurementTechnicalTeam } from '.';

@Entity({ name: 'rfx_revision_approvals' })
export class RfxRevisionApproval extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: ERfxRevisionApprovalStatusEnum,
    default: ERfxRevisionApprovalStatusEnum.APPROVED,
  })
  status: string;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.revisionApprovals)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column({ type: 'uuid', nullable: true })
  rfxProcurementTechnicalTeamId: string;

  @ManyToOne(
    () => RfxProcurementTechnicalTeam,
    (team) => team.rfxRevisionApprovals,
  )
  @JoinColumn({ name: 'rfxProcurementTechnicalTeamId' })
  rfxProcurementTechnicalTeam: RfxProcurementTechnicalTeam;
}
