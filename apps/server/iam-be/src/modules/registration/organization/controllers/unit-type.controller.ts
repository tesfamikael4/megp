import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitType } from '../entities/unit-type.entity';
import { UnitTypeService } from '../services/unit-type.service';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';

@ExtraCrudDecorator({
  entityIdName: 'organizationId',
})
@Controller('unit-type')
@ApiTags('unit-type')
export class UnitTypeController extends ExtraCrudController<UnitType> {
  constructor(private readonly permissionService: UnitTypeService) {
    super(permissionService);
  }
}
