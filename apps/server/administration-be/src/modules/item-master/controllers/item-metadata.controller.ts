import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ItemMetaData } from 'src/entities';
import { ItemMetaDataService } from '../services/extra-services/item-metadata.service';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import {
  CreateItemMetaDataDto,
  UpdateItemMetaDataDto,
} from '../dtos/item-meta-data.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'itemMasterId',
  createDto: CreateItemMetaDataDto,
  updateDto: UpdateItemMetaDataDto,
};
@Controller('item-metadata')
@ApiTags('Item Metadata')
export class ItemMetaDataController extends ExtraCrudController<ItemMetaData>(
  options,
) {
  constructor(private readonly itemMetaDataService: ItemMetaDataService) {
    super(itemMetaDataService);
  }

  @Get('/items')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getItems(@Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.itemMetaDataService.getItems(query);
  }
}
