import { ItemMasterService } from '../services/item-master.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ItemCodeGeneratorService } from '../services/item-code-generator.service';
import { ItemMaster } from 'src/entities/item-master.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateItemMasterDto,
  UpdateItemMasterDto,
} from '../dtos/item-master.dto';
import { EntityCrudController } from 'src/shared/controller';
const options: EntityCrudOptions = {
  createDto: CreateItemMasterDto,
  updateDto: UpdateItemMasterDto,
};
@Controller('item-masters')
@ApiTags('Item Master')
export class ItemMasterConroller extends EntityCrudController<ItemMaster>(
  options,
) {
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

  @Put(':id')
  async updateItemMaster(
    @Param('id') id: string,
    @Body() itemData: any,
  ): Promise<ItemMaster[]> {
    return this.itemMasterService.updateWithChildren(id, itemData);
  }

  @Get('getByParentClassification/:parentId')
  async getByParentClassification(
    @Param('parentId') parentId: string,
  ): Promise<ItemMaster[]> {
    return this.itemMasterService.findByParentClassification(parentId);
  }
}
