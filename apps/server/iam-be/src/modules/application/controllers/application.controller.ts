import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { Application } from '@entities';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../dto/application.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {
  createDto: CreateApplicationDto,
  updateDto: UpdateApplicationDto,
};

@Controller('applications')
@ApiTags('applications')
export class ApplicationNewController extends EntityCrudController<Application>(
  options,
) {
  constructor(private readonly applicationService: ApplicationService) {
    super(applicationService);
  }
}
