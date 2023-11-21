import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { TagService } from '../service/tag.service';
import { Tag } from 'src/entities/tag.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';
import { EntityCrudController } from 'src/shared/controller';
const options: EntityCrudOptions = {
  createDto: CreateTagDto,
  updateDto: UpdateTagDto,
};
@Controller('tags')
@ApiTags(' tags')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TagController extends EntityCrudController<Tag>(options) {
  constructor(private readonly tagService: TagService) {
    super(tagService);
  }
}
