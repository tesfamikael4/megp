import {
  Controller,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { PermissionService } from '../services/permission.service';
import { Permission } from '@entities';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'applicationId',
  createDto: CreatePermissionDto,
  updateDto: UpdatePermissionDto,
};

@Controller('permissions')
@ApiTags('permissions')
export class PermissionNewController extends ExtraCrudController<Permission>(
  options,
) {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
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

    return await this.permissionService.findUnderOrganization(id, query);
  }
}
