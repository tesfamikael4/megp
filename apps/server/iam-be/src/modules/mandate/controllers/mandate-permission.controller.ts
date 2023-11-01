import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MandatePermissionService } from '../services/mandate-permission.service';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'mandateId',
  firstInclude: 'permission',
  secondEntityIdName: 'permissionId',
  secondInclude: 'mandate',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('mandate-permissions')
@ApiTags('mandate-permissions')
export class MandatePermissionController extends RelationCrudController<MandatePermission>(
  options,
) {
  constructor(
    private readonly mandatePermissionService: MandatePermissionService,
  ) {
    super(mandatePermissionService);
  }
}
