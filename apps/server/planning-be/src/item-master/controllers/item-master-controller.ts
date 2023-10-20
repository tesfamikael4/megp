import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ItemMaster } from '../entities/item-master.entity';
import { ItemMasterService } from '../services/item-master.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Param, Put } from '@nestjs/common';
import { ItemCodeGeneratorService } from '../services/item-code-generator.service';

@Controller('item-masters')
@ApiTags('Item Master')
export class ItemMasterConroller extends EntityCrudController<ItemMaster> {
  constructor(
    private readonly itemMasterService: ItemMasterService,
    private readonly itemCodeGenerateService: ItemCodeGeneratorService,
  ) {
    super(itemMasterService);
  }
  @Put('update-status/:id/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: boolean,
  ): Promise<ItemMaster> {
    return this.itemMasterService.updateStatus(id, status);
  }
}
