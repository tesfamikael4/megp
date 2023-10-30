import {
  Controller,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from '../dto/permission.dto';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { CollectionQuery } from 'src/shared/collection-query';
@ExtraCrudDecorator({
  entityIdName: 'applicationId',
})
@Controller('permissions')
@ApiTags('permissions')
export class PermissionNewController extends ExtraCrudController<Permission>(
  CreatePermissionDto,
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
