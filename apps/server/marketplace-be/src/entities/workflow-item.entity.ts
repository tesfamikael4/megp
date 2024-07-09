import { OrgAudit } from 'megp-shared-be';
import { EWorkflowItemAction } from 'src/utils/enums/workflow-item.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowItemDetail } from './workflow-item-detail.entity';

@Entity({ name: 'workflow_items' })
export class WorkflowItem extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  approverId: string;

  @Column()
  approverName: string;

  @Column('uuid')
  objectId: string;

  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @Column({ type: 'boolean', default: true })
  isCurrent: boolean;

  @Column()
  version: number;

  @Column()
  step: number;

  @OneToMany(
    () => WorkflowItemDetail,
    (workflowItemDetail) => workflowItemDetail.workflowItem,
    { cascade: true },
  )
  workflowItemDetails: WorkflowItemDetail[];
}
