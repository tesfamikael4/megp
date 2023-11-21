import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ClassificationService } from '../services/classification.service';
import { Classification } from 'src/entities/classification';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
const options: EntityCrudOptions = {};
@Controller('classifications')
@ApiTags('Classification')
export class ClassificationController extends EntityCrudController<Classification>(
  options,
) {
  constructor(private readonly classificationService: ClassificationService) {
    super(classificationService);
  }
  @Get('/type')
  getDataByType() {
    return this.classificationService.findByType();
  }
}
