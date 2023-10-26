import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { TagService } from '../service/tag.service';
import { Tag } from 'src/entities/tag.entity';

@Controller('tags')
@ApiTags(' tags')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TagController extends EntityCrudController<Tag> {
  constructor(private readonly tagService: TagService) {
    super(tagService);
  }
}
