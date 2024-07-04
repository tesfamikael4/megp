import { Audit } from 'megp-shared-be';
import { EWorkflowItemAction } from 'src/utils/enums/workflow-item.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowItem } from './workflow-item.entity';

@Entity({ name: 'workflow_item_details' })
export class WorkflowItemDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  itemId: string;

  @Column({ type: 'enum', enum: EWorkflowItemAction })
  status: EWorkflowItemAction;

  @Column({ nullable: true })
  remark: string;

  @Column('uuid')
  workflowItemId: string;

  @ManyToOne(
    () => WorkflowItem,
    (workflowItem) => workflowItem.workflowItemDetails,
  )
  @JoinColumn({ name: 'workflowItemId' })
  workflowItem: WorkflowItem;
}
