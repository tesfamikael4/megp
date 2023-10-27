import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MandatePermissionService } from '../services/mandate-permission.service';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@RelationCrudDecorator({
  firstEntityIdName: 'mandateId',
  firstInclude: 'permission',
  secondEntityIdName: 'permissionId',
  secondInclude: 'mandate',
})
@Controller('mandate-permissions')
@ApiTags('mandate-permissions')
export class MandatePermissionController extends RelationCrudController<MandatePermission>(
  'permission',
  'mandate',
) {
  constructor(
    private readonly mandatePermissionService: MandatePermissionService,
  ) {
    super(mandatePermissionService);
  }
}
