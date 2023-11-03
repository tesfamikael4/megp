import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ClassificationPathService } from '../services/classification-path.service';
import { ClassificationPath } from 'src/entities/classification-path';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';

@ExtraCrudDecorator({
  entityIdName: 'classificationId',
})
@Controller('classifications-path')
@ApiTags('Classification Path')
export class ClassificationPathController extends ExtraCrudController<ClassificationPath> {
  constructor(
    private readonly classificationPathService: ClassificationPathService,
  ) {
    super(classificationPathService);
  }
}
