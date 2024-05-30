import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Item } from 'src/entities/tender-item.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ItemService } from '../service/item.service';
import { ReAdvertiseItemDto } from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('items')
@ApiTags('Item Controller')
export class ItemController extends ExtraCrudController<Item>(options) {
  constructor(private readonly ItemService: ItemService) {
    super(ItemService);
  }

  @Post('re-advertise-item')
  async reAdvertiseItem(@Body() itemData: ReAdvertiseItemDto) {
    return this.ItemService.reAdvertiseItem(itemData);
  }
}
