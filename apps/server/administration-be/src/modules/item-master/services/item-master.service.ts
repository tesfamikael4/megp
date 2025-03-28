import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ItemCodeGeneratorService } from './item-code-generator.service';
import { Inject } from '@nestjs/common';
import { ItemMaster } from 'src/entities/item-master.entity';
import { Classification } from 'src/entities/classification.entity';
import { EntityCrudService } from 'src/shared/service';
import { ClassificationService } from 'src/modules/classification/services/classification.service';
import { ItemMetaData, ItemTag } from 'src/entities';
export class ItemMasterService extends EntityCrudService<ItemMaster> {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(ItemMaster)
    private readonly itemMasterRepository: Repository<ItemMaster>,
    @InjectRepository(ItemMetaData)
    private readonly itemMetaDataRepository: Repository<ItemMetaData>,
    @Inject(ItemCodeGeneratorService)
    private readonly itemCodeGenerateService: ItemCodeGeneratorService,
    private readonly classificationService: ClassificationService,
    @InjectRepository(ItemTag)
    private readonly itemTagRepository: Repository<ItemTag>,
  ) {
    super(itemMasterRepository);
  }

  async findOne(id: string): Promise<ItemMaster> {
    return this.itemMasterRepository.findOne({
      where: { id },
      relations: {
        itemTags: true,
      },
    });
  }

  async create(itemData: ItemMaster): Promise<ItemMaster> {
    itemData.itemCode = await this.getItemCode(itemData.commodityCode);

    const commodityCode = itemData.commodityCode;
    const hierarchy: any[] =
      await this.classificationService.findClassificationHistory(commodityCode);

    const itemMetaData = [];
    hierarchy.forEach((el) => {
      itemMetaData.push({ code: el.code, name: el.title });
    });
    itemData.itemMetaData = itemMetaData;
    const instance = this.itemMasterRepository.create(itemData);
    return await this.itemMasterRepository.save(instance);
  }

  async updateWithChildren(id: string, itemData: any): Promise<ItemMaster[]> {
    if (itemData.commodityCode) {
      const commodityCode = itemData.commodityCode;
      const hierarchy: any[] =
        await this.classificationService.findClassificationHistory(
          commodityCode,
        );

      const itemMetaData = [];
      hierarchy.forEach((el) => {
        itemMetaData.push({ code: el.code, name: el.title });
      });
      itemData.itemMetaData = itemMetaData;
    }
    const existingItem = await this.findOne(id);
    // Identify tags to remove
    const tagsToRemove = existingItem.itemTags.filter(
      (tag) => !itemData.itemTags.includes(tag.id),
    );
    // Remove the tags that are not in the updated list
    await this.itemTagRepository.remove(tagsToRemove);
    const instance = this.itemMasterRepository.create({
      ...itemData,
      id,
      itemTags: itemData.itemTags,
    });
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

  async findByParentClassification(parentCode: string) {
    const classifications = await this.classificationRepository.find({
      where: { parentCode },
    });
    const codes = classifications.map((c) => c.code);
    return this.itemMasterRepository.find({
      where: { commodityCode: In(codes) },
    });
  }
}
