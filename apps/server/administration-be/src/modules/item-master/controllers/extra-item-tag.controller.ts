import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraItemTagService } from '../services/extra-services/extra-tem-tag.service';
import { ItemTag } from 'src/entities/item-tag.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
const options: ExtraCrudOptions = {
  entityIdName: 'itemMasterId',
};
@Controller('extra-item-tags')
@ApiTags('Extra Item Tag')
export class ExtraItemTagController extends ExtraCrudController<ItemTag>(
  options,
) {
  constructor(private readonly extraItemTagService: ExtraItemTagService) {
    super(extraItemTagService);
  }
}
