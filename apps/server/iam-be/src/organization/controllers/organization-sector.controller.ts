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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import {
  CreateOrganizationSectorDto,
  UpdateOrganizationSectorDto,
} from '../dto/organization-sector.dto';
import { OrganizationSector } from '../entities/organization-sector.entity';
import { OrganizationSectorService } from '../services/organization-sector.service';

@ApiBearerAuth()
@Controller('organizationSectors')
@ApiTags('organizationSectors')
export class OrganizationSectorController {
  constructor(
    private readonly organizationSectorService: OrganizationSectorService,
  ) {}

  @Post('create')
  async create(
    @Body() createOrganizationSectorDto: CreateOrganizationSectorDto,
  ) {
    return await this.organizationSectorService.create(
      createOrganizationSectorDto,
    );
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.organizationSectorService.findOne(id);
  }

  @Get('get-all')
  @ApiPaginatedResponse(OrganizationSector)
  async findAll(@Query() query: CollectionQuery) {
    return await this.organizationSectorService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationSectorDto: UpdateOrganizationSectorDto,
  ) {
    return await this.organizationSectorService.update(
      id,
      updateOrganizationSectorDto,
    );
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.organizationSectorService.remove(id);
  }
}
