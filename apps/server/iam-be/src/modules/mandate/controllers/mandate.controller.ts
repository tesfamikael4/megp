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
export class MandateController extends EntityCrudController<Mandate>() {
  constructor(private readonly mandateService: MandateService) {
    super(mandateService);
  }
  @Post()
  async create(@Body() createMandateDto: CreateMandateDto): Promise<Mandate> {
    return await super.create(createMandateDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateMandateDto: UpdateMandateDto,
  ): Promise<Mandate | undefined> {
    return await super.update(id, updateMandateDto);
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
