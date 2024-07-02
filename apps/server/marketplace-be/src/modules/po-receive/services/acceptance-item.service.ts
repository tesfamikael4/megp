import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { AcceptanceItem } from 'src/entities';

import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AcceptanceItemService extends ExtraCrudService<AcceptanceItem> {
  constructor(
    @InjectRepository(AcceptanceItem)
    private readonly acceptanceItemRepository: Repository<AcceptanceItem>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(acceptanceItemRepository);
  }

  async buckCreate(payload: any, acceptanceNoteId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    payload.forEach((data) => {
      data.acceptanceNoteId = acceptanceNoteId;
      data.orderedQuantity = data.quantityDelivered;
      data.deliveredQuantity = data.quantityAccepted;
    });
    const data = this.acceptanceItemRepository.create(payload);
    await entityManager.getRepository(AcceptanceItem).insert(data);
  }
}
