import { Post, Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Permission } from 'src/entities/permission.entity';
import { PermissionService } from '../services/permission.service';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('permissions')
@ApiTags('permissions')
export class PermissionController extends ExtraCrudController<Permission>(
  options,
) {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() defaultStep: any): Promise<any> {
    return this.permissionService.bulkCreate(defaultStep);
  }
}
