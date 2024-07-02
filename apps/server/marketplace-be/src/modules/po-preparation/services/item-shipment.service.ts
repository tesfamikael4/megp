import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { ItemShipment, POItem } from 'src/entities';

import { EntityManager, Repository } from 'typeorm';
import { POItemService } from './po-item.service';
import { POShipmentService } from './po-shipment.service';

@Injectable()
export class ItemShipmentService extends ExtraCrudService<ItemShipment> {
  constructor(
    @InjectRepository(ItemShipment)
    private readonly itemShipmentRepository: Repository<ItemShipment>,
    private readonly poItemRepository: POItemService,
    private readonly poShipmentRepository: POShipmentService,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(itemShipmentRepository);
  }

  async bulkCreate(itemShipment: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    for (const item of itemShipment.poItems) {
      const poItem = await this.poItemRepository.findOne(item.id);
      if (Number(poItem.availableQuantity) < Number(item.quantity)) {
        throw new HttpException('Quantity not available', 430);
      }
      const poShipment = await this.poShipmentRepository.findOne(
        itemShipment.poShipmentId,
      );
      if (poItem.purchaseOrderId != poShipment.purchaseOrderId) {
        throw new HttpException('Purchase order not the same', 430);
      }
      const existingItemShipment = await this.itemShipmentRepository.findOne({
        where: {
          poItemId: item.id,
          poShipmentId: itemShipment.poShipmentId,
        },
        select: { quantity: true },
      });
      await entityManager.getRepository(POItem).update(item.id, {
        availableQuantity: poItem.availableQuantity - item.quantity,
      });

      if (existingItemShipment) {
        await entityManager.getRepository(ItemShipment).delete({
          poItemId: item.id,
          poShipmentId: itemShipment.poShipmentId,
        });
        item.quantity =
          Number(item.quantity) + Number(existingItemShipment.quantity);
      }
      itemShipment.poItemId = poItem.id;
      itemShipment.itemName = poItem.name;
      itemShipment.quantity = item.quantity;
      itemShipment.price = poItem.price;
      itemShipment.uom = poItem.uom;
      itemShipment.currency = poItem.currency;
    }

    const createdData = this.itemShipmentRepository.create(itemShipment);
    await entityManager.getRepository(ItemShipment).insert(createdData);

    return createdData;
  }
}
