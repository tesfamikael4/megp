import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'megp-shared-be';
import { WorkflowItem } from 'src/entities';

@Injectable()
export class WorkflowItemService extends EntityCrudService<WorkflowItem> {
  constructor(
    @InjectRepository(WorkflowItem)
    private readonly repositoryWorkflowItems: Repository<WorkflowItem>,
  ) {
    super(repositoryWorkflowItems);
  }

  async getWorkflowItemByObjectId(objectId: string, step: number, user: any) {
    return await this.repositoryWorkflowItems.findOne({
      where: {
        isCurrent: true,
        objectId,
        step,
        approverId: user.userId,
      },
    });
  }

  async completeEvaluationApproval(objectId: string, step: number, user: any) {
    const pendingItem = await this.repositoryWorkflowItems.findOne({
      where: {
        step,
        approverId: user.userId,
        isCurrent: true,
        objectId,
      },
    });

    if (!pendingItem) {
      throw new Error('No Workflow Item Found');
    }

    if (pendingItem.isComplete) {
      throw new Error('Workflow Item is already completed');
    }

    return await this.repositoryWorkflowItems.update(pendingItem.id, {
      isComplete: true,
    });
  }

  async getCurrentItem(rfxId: string, user: any) {
    return await this.repositoryWorkflowItems.findOneBy({
      id: rfxId,
      isCurrent: true,
      approverId: user.userId,
    });
  }

  async getCurrentItemWithDetails(rfxId: string, step: number, user: any) {
    return await this.repositoryWorkflowItems.findOne({
      where: {
        step,
        objectId: rfxId,
        isCurrent: true,
        approverId: user.userId,
      },
      relations: {
        workflowItemDetails: true,
      },
    });
  }
}
