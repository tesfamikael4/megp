import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemCoATag } from 'src/entities';
import { ItemCoATagService } from '../services/item-co-atag.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'activityCoAtagId',
};

@Controller('item-coa-tags')
@ApiTags('item-coa-tags')
export class ItemCoATagController extends ExtraCrudController<ItemCoATag>(
  options,
) {
  constructor(private readonly itemCoATagService: ItemCoATagService) {
    super(itemCoATagService);
  }
}
