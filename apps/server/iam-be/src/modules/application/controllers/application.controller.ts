import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { Application } from '../entities/application.entity';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { CreateApplicationDto } from '../dto/application.dto';

@Controller('applications')
@ApiTags('applications')
export class ApplicationNewController extends EntityCrudController<Application>(
  CreateApplicationDto,
) {
  constructor(private readonly applicationService: ApplicationService) {
    super(applicationService);
  }
}
