import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ItemCodeGeneratorService } from './item-code-generator.service';
import { Inject } from '@nestjs/common';
import { ItemMaster } from 'src/entities/item-master.entity';
import { Classification } from 'src/entities/classification';
import { EntityCrudService } from 'src/shared/service';
export class ItemMasterService extends EntityCrudService<ItemMaster> {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(ItemMaster)
    private readonly itemMasterRepository: Repository<ItemMaster>,
    @Inject(ItemCodeGeneratorService)
    private readonly itemCodeGenerateService: ItemCodeGeneratorService,
  ) {
    super(itemMasterRepository);
  }

  async create(itemData: ItemMaster): Promise<ItemMaster> {
    itemData.itemCode = await this.getItemCode(itemData.commodityCode);
    return await super.create(itemData);
  }
  async updateWithTags(id: string, itemData: ItemMaster): Promise<ItemMaster> {
    await this.findOne(id);
    const instance = this.itemMasterRepository.create({ ...itemData, id: id });
    return await this.itemMasterRepository.save(instance);
  }

  async updateStatus(id: string, status: boolean): Promise<ItemMaster> {
    const entity = await this.findOne(id);
    entity.isActive = status;
    return await super.update(id, entity);
  }

  async getItemCode(commodityCode: string): Promise<string> {
    const generatedCode = await this.itemCodeGenerateService.generate();
    return commodityCode + '-' + generatedCode;
  }

  async findByParentClassification(parentId: string) {
    const classifications = await this.classificationRepository.find({
      where: { parentId },
    });
    const codes = classifications.map((c) => c.code);
    return this.itemMasterRepository.find({
      where: { commodityCode: In(codes) },
    });
  }
}
