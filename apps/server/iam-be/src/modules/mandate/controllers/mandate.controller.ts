import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateMandateDto, UpdateMandateDto } from '../dto/mandate.dto';
import { MandateService } from '../services/mandate.service';
import { Mandate } from '../entities/mandate.entity';
import { CollectionQuery } from '@collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';

@Controller('mandates')
@ApiTags('mandates')
export class MandateController extends EntityCrudController<Mandate>(
  CreateMandateDto,
) {
  constructor(private readonly mandateService: MandateService) {
    super(mandateService);
  }
  @Get('get-all-to-assign/:organizationId')
  @ApiPaginatedResponse(Mandate)
  async getMandatesToAssign(
    @Param('organizationId') organizationId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.mandateService.fetchMandatesToAssign(
      organizationId,
      query,
    );
  }
}
