import { Audit, OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { EvalApprovalDetail } from './eval-approval-details.entity';

@Entity({ name: 'eval_approvals' })
export class EvalApproval extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  evaluatorId: string;

  @Column()
  evaluatorName: string;

  @Column()
  order: number;

  @Column({ default: 0 })
  version: number;

  @Column({ type: 'boolean', default: true })
  isCurrent: boolean;

  @Column({ type: 'boolean', default: false })
  isDone: boolean;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.evalApprovals)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToMany(
    () => EvalApprovalDetail,
    (evalApprovalDetail) => evalApprovalDetail.evalApproval,
  )
  evalApprovalDetails: EvalApprovalDetail[];
}
