import {
    Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraItemTagService } from '../services/extra-services/extra-tem-tag.service';
import { ItemTag } from '../entities/item-tag.entity';

@ExtraCrudDecorator({
    entityIdName: 'itemMasterId',
})
@Controller('extra-item-tags')
@ApiTags('Extra Item Tag')
export class ExtraItemTagController extends ExtraCrudController<ItemTag> {
    constructor(private readonly extraItemTagService: ExtraItemTagService) {
        super(extraItemTagService);
    }
}
