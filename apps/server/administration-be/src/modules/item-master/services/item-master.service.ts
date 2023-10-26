import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemCodeGeneratorService } from './item-code-generator.service';
import { Inject } from '@nestjs/common';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { ItemMaster } from 'src/entities/item-master.entity';

export class ItemMasterService extends EntityCrudService<ItemMaster> {
  constructor(
    @InjectRepository(ItemMaster)
    private readonly itemMasterRepository: Repository<ItemMaster>,
    @Inject(ItemCodeGeneratorService)
    private readonly itemCodeGenerateService: ItemCodeGeneratorService,
  ) {
    super(itemMasterRepository);
  }

  async create(itemData: ItemMaster, req?: any): Promise<ItemMaster> {
    itemData.itemCode = await this.getItemCode(itemData.commodityCode);
    return await super.create(itemData);
  }

  async updateStatus(id: string, status: boolean): Promise<ItemMaster> {
    const entity = await this.findOneOrFail(id);
    entity.isActive = status;
    return await super.update(id, entity);
  }

  async getItemCode(commodityCode: string): Promise<string> {
    const generatedCode = await this.itemCodeGenerateService.generate();
    return commodityCode + '-' + generatedCode;
  }
}
