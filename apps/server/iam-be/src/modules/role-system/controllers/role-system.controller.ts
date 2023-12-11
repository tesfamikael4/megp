import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRoleSystemDto,
  UpdateRoleSystemDto,
} from '../dto/role-system.dto';
import { RoleSystemService } from '../services/role-system.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { RoleSystem } from 'src/entities/role-system.entity';
import { EntityCrudController } from 'src/shared/controller';

const options: EntityCrudOptions = {
  createDto: CreateRoleSystemDto,
  updateDto: UpdateRoleSystemDto,
};

@Controller('role-systems')
@ApiTags('role-systems')
export class RoleSystemController extends EntityCrudController<RoleSystem>(
  options,
) {
  constructor(private readonly roleService: RoleSystemService) {
    super(roleService);
  }
}
