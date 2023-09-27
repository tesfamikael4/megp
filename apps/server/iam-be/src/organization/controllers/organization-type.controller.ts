import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import {
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
} from '../dto/organization-type.dto';
import { OrganizationType } from '../entities/organization-type.entity';
import { OrganizationTypeService } from '../services/organization-type.service';

@ApiBearerAuth()
@Controller('organizationTypes')
@ApiTags('organizationTypes')
export class OrganizationTypeController {
  constructor(
    private readonly organizationTypeService: OrganizationTypeService,
  ) {}

  @Post('create')
  async create(@Body() createOrganizationTypeDto: CreateOrganizationTypeDto) {
    return await this.organizationTypeService.create(createOrganizationTypeDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationTypeService.findOne(id);
  }

  @Get('get-all')
  @ApiPaginatedResponse(OrganizationType)
  @ApiOkResponse({ type: OrganizationType, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.organizationTypeService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationTypeDto: UpdateOrganizationTypeDto,
  ) {
    return await this.organizationTypeService.update(
      id,
      updateOrganizationTypeDto,
    );
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.organizationTypeService.remove(id);
  }
}
