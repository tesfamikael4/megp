import {
  Body,
  Controller,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import {
  CreateOrganizationSectorDto,
  UpdateOrganizationSectorDto,
} from '../dto/organization-sector.dto';
import { OrganizationSector } from '../entities/organization-sector.entity';
import { OrganizationSectorService } from '../services/organization-sector.service';

@Controller('organization-sector')
@ApiTags('organization-sector')
export class OrganizationSectorController extends EntityCrudController<OrganizationSector> {
  constructor(private readonly permissionService: OrganizationSectorService) {
    super(permissionService);
  }

  @Post()
  async create(
    @Body() createOrganizationSectorDto: CreateOrganizationSectorDto,
  ): Promise<OrganizationSector> {
    return await super.create(createOrganizationSectorDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationSectorDto: UpdateOrganizationSectorDto,
  ): Promise<OrganizationSector | undefined> {
    return await super.update(id, updateOrganizationSectorDto);
  }
}
