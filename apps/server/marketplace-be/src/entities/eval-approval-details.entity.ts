import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { EvalApproval } from './eval-approval.entity';
import { RFXItem } from '.';
import { EEvaluationApproval } from 'src/utils/enums';

@Entity({ name: 'eval_approval_details' })
export class EvalApprovalDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  evalApprovalId: string;

  @ManyToOne(
    () => EvalApproval,
    (evalApproval) => evalApproval.evalApprovalDetails,
  )
  @JoinColumn({ name: 'evalApprovalId' })
  evalApproval: EvalApproval;

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfxItem) => rfxItem.evalApprovalDetails)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column({ type: 'enum', enum: EEvaluationApproval })
  status: EEvaluationApproval;

  @Column({ nullable: true })
  remark: string;
}
