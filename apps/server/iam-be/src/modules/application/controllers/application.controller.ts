import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { Application } from '@entities';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../dto/application.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';

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

  @Get('organization/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async findUnderOrganization(@Param('id') id: string, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);

    return await this.applicationService.findUnderOrganization(id, query);
  }
}
