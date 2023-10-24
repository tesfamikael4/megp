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
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@ExtraCrudDecorator({
  entityIdName: 'applicationId',
})
@Controller('permissions')
@ApiTags('permissions')
export class PermissionNewController extends ExtraCrudController<Permission>() {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await super.create(createPermissionDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission | undefined> {
    return await super.update(id, updatePermissionDto);
  }
}
