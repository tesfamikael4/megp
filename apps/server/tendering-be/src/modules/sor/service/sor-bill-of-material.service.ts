import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { BulkCreateBillOfMaterialDto } from '../dto/sor-bill-of-material.dto';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';

@Injectable()
export class SorBillOfMaterialService extends ExtraCrudService<SorBillOfMaterial> {
  constructor(
    @InjectRepository(SorBillOfMaterial)
    private readonly sorBillOfMaterialRepository: Repository<SorBillOfMaterial>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(sorBillOfMaterialRepository);
  }

  async bulkCreate(
    itemData: BulkCreateBillOfMaterialDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await manager
      .getRepository(SorBillOfMaterial)
      .delete({ itemId: itemData.itemId });
    const item = manager.getRepository(SorBillOfMaterial).create(itemData.boqs);
    await manager.getRepository(SorBillOfMaterial).insert(item);
    return item;
  }
}
