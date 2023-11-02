import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ClassificationPathService } from '../services/classification-path.service';
import { ClassificationPath } from 'src/entities/classification-path';

@Controller('classifications-path')
@ApiTags('Classification Path')
export class ClassificationPathController extends EntityCrudController<ClassificationPath> {
  constructor(
    private readonly classificationPathService: ClassificationPathService,
  ) {
    super(classificationPathService);
  }
}