import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { Application } from '../entities/application.entity';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';

@Controller('applications')
@ApiTags('applications')
export class ApplicationNewController extends EntityCrudController<Application> {
  constructor(private readonly applicationService: ApplicationService) {
    super(applicationService);
  }
}
