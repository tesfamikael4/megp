import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Query, Get } from '@nestjs/common';
import { ClassificationService } from '../services/classification.service';
import { Classification } from 'src/entities/classification.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateClassificationDto } from '../dtos/create-classfication.dto';
import { ExtraCrudController } from 'src/shared/controller';
import { decodeCollectionQuery } from 'src/shared/collection-query';

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
  @Get()
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  getChildren(@Query('q') q?: string) {
    try {
      const query = decodeCollectionQuery(q);
      return this.classificationService.findChildren(query);
    } catch (error) {
      throw error;
    }
  }
}
