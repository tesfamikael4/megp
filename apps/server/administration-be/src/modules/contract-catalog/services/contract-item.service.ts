import { Injectable } from '@nestjs/common';
import { ContractItem, ProductCatalog } from '@entities';
import { ExtraCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractItemsService extends ExtraCrudService<ContractItem> {
  constructor(
    @InjectRepository(ContractItem)
    private readonly contractItemRepository: Repository<ContractItem>,
    @InjectRepository(ProductCatalog)
    private readonly productCatalogRepository: Repository<ProductCatalog>,
  ) {
    super(contractItemRepository);
  }
  async create(itemData: any, req?: any): Promise<any> {
    const productCatalog = await this.productCatalogRepository.findOne({
      where: { itemMasterId: itemData.itemMasterId },
    })
    itemData.specification = productCatalog ? productCatalog.specificationValues : [];
    const item = this.contractItemRepository.create(itemData);
    return await this.contractItemRepository.save(item);
  }

  async update(id: string, itemData: any, req?: any): Promise<any> {
    const contractItem = await this.contractItemRepository.findOne({
      where: { id: id },
    })
    const productCatalog = await this.productCatalogRepository.findOne({
      where: { itemMasterId: itemData.itemMasterId },
    })
    itemData.specifications = productCatalog ? productCatalog.specificationValues : [];
    await this.contractItemRepository.update(contractItem.id, itemData);
    return {
      ...contractItem,
      ...itemData,
    };
  }
}
