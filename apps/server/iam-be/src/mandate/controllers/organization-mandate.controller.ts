import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CreateOrganizationMandateDto, UpdateOrganizationMandateDto } from '../dto/organization-mandate.dto';
import { OrganizationMandateService } from '../services/organization-mandate.service';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import { CollectionQuery, } from '@collection-query';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';

@Controller('organization-mandate-news')
@ApiTags('organization-mandate-news')
export class OrganizationMandateController extends GenericCrudController<OrganizationMandate>  {

  constructor(private readonly organizationMandateService: OrganizationMandateService) {
    super(organizationMandateService);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<OrganizationMandate>> {
    return await super.findAll(query);
  }

  @Post()
  async create(@Body() createOrganizationMandateDto: CreateOrganizationMandateDto): Promise<OrganizationMandate> {
    return await super.create(createOrganizationMandateDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
    @Body() updateOrganizationMandateDto: UpdateOrganizationMandateDto,
  ): Promise<OrganizationMandate | undefined> {
    return await super.update(id, updateOrganizationMandateDto);
  }

}