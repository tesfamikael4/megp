import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ENTITY_MANAGER_KEY,
  RelationCrudOptions,
  RelationCrudService,
} from 'megp-shared-be';
import { AcceptanceReceive } from 'src/entities';

import { EntityManager, Repository } from 'typeorm';
import { ReceivingItemService } from './receiving-item.service';

@Injectable()
export class AcceptanceReceiveService extends RelationCrudService<AcceptanceReceive> {
  constructor(
    @InjectRepository(AcceptanceReceive)
    private readonly acceptanceReceiveRepository: Repository<AcceptanceReceive>,

    @Inject(REQUEST)
    private readonly request: Request,
    private readonly receivingItemService: ReceivingItemService,
  ) {
    super(acceptanceReceiveRepository);
  }

  async bulkSaveFirst(payload: any, relationCrudOptions: RelationCrudOptions) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const firstEntityIdName = relationCrudOptions.firstEntityIdName;
    const secondEntityIdName = relationCrudOptions.secondEntityIdName;

    const include = relationCrudOptions.firstInclude;
    const entityId: string = payload[firstEntityIdName];

    const parsedPayload: any[] = [];

    const childData: any[] = payload[include];
    childData.forEach((data) => {
      parsedPayload.push({
        [firstEntityIdName]: entityId,
        [secondEntityIdName]: data,
      });
    });

    const deleteCondition = {};
    deleteCondition[firstEntityIdName] = entityId;

    await entityManager
      .getRepository(AcceptanceReceive)
      .delete(deleteCondition);

    const data = this.acceptanceReceiveRepository.create(parsedPayload);

    await entityManager.getRepository(AcceptanceReceive).insert(data);
    await this.receivingItemService.findAlls(childData, entityId);

    return data;
  }

  async bulk2SaveFirst(payload: any, relationCrudOptions: RelationCrudOptions) {
    const firstEntityIdName = relationCrudOptions.firstEntityIdName;
    const secondEntityIdName = relationCrudOptions.secondEntityIdName;

    const include = relationCrudOptions.firstInclude;
    const entityId: string = payload[firstEntityIdName];

    const parsedPayload: any[] = [];

    const childData: any[] = payload[include];
    childData.forEach((data) => {
      parsedPayload.push({
        [firstEntityIdName]: entityId,
        [secondEntityIdName]: data,
      });
    });

    const deleteCondition = {};
    deleteCondition[firstEntityIdName] = entityId;

    await this.acceptanceReceiveRepository.delete(deleteCondition);

    const data = this.acceptanceReceiveRepository.create(parsedPayload);
    await this.acceptanceReceiveRepository.insert(data);
    return data;
  }
}
