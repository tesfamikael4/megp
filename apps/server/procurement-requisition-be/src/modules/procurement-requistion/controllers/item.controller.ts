import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Item } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateItemDto, UpdateItemDto } from '../dto/item.dto';
import { ItemService } from '../services/item.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateItemDto,
  updateDto: UpdateItemDto,
};

@Controller('items')
@ApiTags('items')
export class ItemController extends ExtraCrudController<Item>(options) {
  constructor(private readonly procurementRequisitionItemService: ItemService) {
    super(procurementRequisitionItemService);
  }
}
