import {
  Controller,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { PermissionService } from '../services/permission.service';
import { Permission } from '@entities';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CollectionQuery } from 'src/shared/collection-query';

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
  async findUnderOrganization(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.permissionService.findUnderOrganization(id, query);
  }
}
