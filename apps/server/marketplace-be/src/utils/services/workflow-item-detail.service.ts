import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { WorkflowItem, WorkflowItemDetail } from 'src/entities';
import {
  CreateWorkflowItemDetailDto,
  UpdateWorkflowItemDetailDto,
} from '../dtos/workflow-item-detail.dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class WorkflowItemDetailService extends ExtraCrudService<WorkflowItemDetail> {
  constructor(
    @InjectRepository(WorkflowItemDetail)
    private readonly repositoryWorkflowItemDetails: Repository<WorkflowItemDetail>,
    @InjectRepository(WorkflowItem)
    private readonly repositoryWorkflowItem: Repository<WorkflowItem>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(repositoryWorkflowItemDetails);
  }

  async create(itemData: CreateWorkflowItemDetailDto, req?: any): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const workflowItem = await this.repositoryWorkflowItem.findOne({
      where: {
        organizationId: req.user.organization.id,
        approverId: req.user.userId,
        objectId: itemData.objectId,
        step: itemData.step,
      },
    });

    if (!workflowItem) {
      const workflowItemRepo = entityManager.getRepository(WorkflowItem);

      const itemDetail = this.repositoryWorkflowItemDetails.create({
        ...itemData,
      });
      const workflowItemParent = workflowItemRepo.create({
        approverId: req.user.userId,
        approverName: `${req.user.firstName} ${req.user.lastName}`,
        objectId: itemData.objectId,
        organizationId: req.user.organization.id,
        organizationName: req.user.organization.name,
        step: itemData.step,
        version: 0,
        workflowItemDetails: [itemDetail],
      });

      await workflowItemRepo.save(workflowItemParent);
    } else {
      const item = this.repositoryWorkflowItemDetails.create({
        ...itemData,
        workflowItemId: workflowItem.id,
      });

      await this.repositoryWorkflowItemDetails.insert(item);
    }
  }

  async updateItem(
    id: string,
    itemData: UpdateWorkflowItemDetailDto,
    req: any,
  ): Promise<WorkflowItemDetail | undefined> {
    const item = await this.repositoryWorkflowItem.findOne({
      where: {
        objectId: itemData.objectId,
        step: itemData.step,
        isCurrent: true,
        approverId: req.user.userId,
      },
      select: {
        id: true,
        isComplete: true,
      },
    });

    if (!item) {
      throw new BadRequestException('Workflow Item Not Found');
    }

    if (item.isComplete) {
      throw new BadRequestException('Workflow Item Already Completed');
    }
    const itemDetail = await this.repositoryWorkflowItemDetails.findOne({
      where: {
        id,
        workflowItemId: item.id,
      },
    });

    if (!itemDetail) {
      throw new BadRequestException('Workflow Item Detail Not Found');
    }

    const createdItemDetail =
      this.repositoryWorkflowItemDetails.create(itemData);
    await this.repositoryWorkflowItemDetails.update(id, createdItemDetail);
    return createdItemDetail;
  }

  async getMyLatestResponse(itemId: string, step: number, user: any) {
    return await this.repositoryWorkflowItemDetails.findOne({
      where: {
        itemId,
        workflowItem: {
          step,
          approverId: user.userId,
        },
      },
    });
  }

  async getPreviousResult(itemId: string) {
    return await this.repositoryWorkflowItemDetails.find({
      where: {
        itemId,
      },
      relations: {
        workflowItem: true,
      },
      select: {
        id: true,
        status: true,
        workflowItem: {
          id: true,
          updatedAt: true,
          step: true,
          approverId: true,
          approverName: true,
        },
      },
    });
  }

  async getLatestPendingDetails(objectId: string, approverId: string) {
    return await this.repositoryWorkflowItemDetails.find({
      where: {
        workflowItem: {
          approverId,
          id: objectId,
          isCurrent: true,
          isComplete: false,
        },
      },
    });
  }
}
