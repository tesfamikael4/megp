import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ClassificationPathService } from '../services/classification-path.service';
import { ClassificationPath } from 'src/entities/classification-path';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
const options: ExtraCrudOptions = {
  entityIdName: 'classificationId',
};
@Controller('classifications-path')
@ApiTags('Classification Path')
export class ClassificationPathController extends ExtraCrudController<ClassificationPath>(
  options,
) {
  constructor(
    private readonly classificationPathService: ClassificationPathService,
  ) {
    super(classificationPathService);
  }
}
