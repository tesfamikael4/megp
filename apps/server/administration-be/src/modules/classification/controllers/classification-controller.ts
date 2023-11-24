import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Query,
  Param,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ClassificationService } from '../services/classification.service';
import { Classification } from 'src/entities/classification.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateClassificationDto } from '../dtos/create-classfication.dto';
import { ExtraCrudController } from 'src/shared/controller';
import { CollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'taxonomyCodeSetId',
  createDto: CreateClassificationDto,
};

@Controller('classifications')
@ApiTags('Classification')
export class ClassificationController extends ExtraCrudController<Classification>(
  options,
) {
  constructor(private readonly classificationService: ClassificationService) {
    super(classificationService);
  }
  @Get('children')
  @ApiQuery({
    name: 'code',
    type: String,
    required: false,
  })
  getChildren(@Query() query: CollectionQuery, @Query('code') code?: string) {
    console.log('');
    return this.classificationService.findChildren(query, code);
  }
}
