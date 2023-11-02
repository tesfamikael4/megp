import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ClassificationService } from '../services/classification.service';
import { Classification } from 'src/entities/classification';

@Controller('classifications')
@ApiTags('Classification')
export class ClassificationController extends EntityCrudController<Classification> {
  constructor(
    private readonly classificationService: ClassificationService,
  ) {
    super(classificationService);
  }
}