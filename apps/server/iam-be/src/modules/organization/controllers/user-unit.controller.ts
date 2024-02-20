import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserUnit } from '@entities';
import { UserUnitService } from '../services/user-unit.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'userId',
  firstInclude: 'unit',
  secondEntityIdName: 'unitId',
  secondInclude: 'user',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('user-unit')
@ApiTags('user-unit')
export class UserUnitController extends RelationCrudController<UserUnit>(
  options,
) {
  constructor(private readonly userUnitService: UserUnitService) {
    super(userUnitService);
  }
}
