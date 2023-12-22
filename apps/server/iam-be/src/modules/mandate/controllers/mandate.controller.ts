import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateMandateDto, UpdateMandateDto } from '../dto/mandate.dto';
import { MandateService } from '../services/mandate.service';
import { Mandate } from '@entities';
import { CollectionQuery, decodeCollectionQuery } from '@collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {
  createDto: CreateMandateDto,
  updateDto: UpdateMandateDto,
};

@Controller('mandates')
@ApiTags('mandates')
export class MandateController extends EntityCrudController<Mandate>(options) {
  constructor(private readonly mandateService: MandateService) {
    super(mandateService);
  }

  @Get('organization/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiPaginatedResponse(Mandate)
  async getMandatesToAssign(@Param('id') id: string, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);

    return await this.mandateService.fetchMandatesToAssign(id, query);
  }
}
