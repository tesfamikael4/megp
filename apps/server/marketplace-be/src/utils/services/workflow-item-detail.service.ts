import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
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
import { CreateWorkflowItemDetailDto } from '../dtos/workflow-item-detail.dto';
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
      },
    });

    if (!workflowItem) {
      const workflowItemRepo = entityManager.getRepository(WorkflowItem);

      const itemDetail = this.repositoryWorkflowItemDetails.create({
        ...itemData,
      });
      const workflowItemParent = workflowItemRepo.create({
        approverId: req.user.userId,
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

  async getPreviousStepResult(
    itemId: string,
    currentStep: number,
    query: CollectionQuery,
  ) {
    query.where.push(
      [
        {
          column: 'itemId',
          operator: FilterOperators.EqualTo,
          value: itemId,
        },
      ],
      [
        {
          column: 'step',
          operator: FilterOperators.EqualTo,
          value: currentStep - 1,
        },
      ],
    );

    const dataQuery = QueryConstructor.constructQuery<WorkflowItemDetail>(
      this.repositoryWorkflowItemDetails,
      query,
    );

    const response = new DataResponseFormat<WorkflowItemDetail>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
  }
}
