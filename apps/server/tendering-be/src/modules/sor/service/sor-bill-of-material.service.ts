import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { BulkCreateBillOfMaterialDto } from '../dto/sor-bill-of-material.dto';

@Injectable()
export class SorBillOfMaterialService extends ExtraCrudService<SorBillOfMaterial> {
  constructor(
    @InjectRepository(SorBillOfMaterial)
    private readonly sorBillOfMaterialRepository: Repository<SorBillOfMaterial>,
  ) {
    super(sorBillOfMaterialRepository);
  }

  async bulkCreate(
    itemData: BulkCreateBillOfMaterialDto,
    req?: any,
  ): Promise<any> {
    const item = this.sorBillOfMaterialRepository.create(itemData.boqs);
    await this.sorBillOfMaterialRepository.insert(item);
    return item;
  }
}
