import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserUnit } from '../entities/user-unit.entity';
import { UserUnitService } from '../services/user-unit.service';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@RelationCrudDecorator({
  firstEntityIdName: 'userId',
  firstInclude: 'unit',
  secondEntityIdName: 'unitId',
  secondInclude: 'user',
})
@Controller('user-unit')
@ApiTags('user-unit')
export class UserUnitController extends RelationCrudController<UserUnit>(
  'unit',
  'user',
) {
  constructor(private readonly userUnitService: UserUnitService) {
    super(userUnitService);
  }
}
