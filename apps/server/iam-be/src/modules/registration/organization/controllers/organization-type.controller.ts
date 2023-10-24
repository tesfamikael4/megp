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
import { OrganizationType } from '../entities/organization-type.entity';
import {
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
} from '../dto/organization-type.dto';
import { OrganizationTypeService } from '../services/organization-type.service';

@Controller('organization-type')
@ApiTags('organization-type')
export class OrganizationTypeController extends EntityCrudController<OrganizationType> {
  constructor(private readonly permissionService: OrganizationTypeService) {
    super(permissionService);
  }

  @Post()
  async create(
    @Body() createOrganizationTypeDto: CreateOrganizationTypeDto,
  ): Promise<OrganizationType> {
    return await super.create(createOrganizationTypeDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateOrganizationTypeDto: UpdateOrganizationTypeDto,
  ): Promise<OrganizationType | undefined> {
    return await super.update(id, updateOrganizationTypeDto);
  }
}
