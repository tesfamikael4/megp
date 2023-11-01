import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnitType } from '../entities/unit-type.entity';
import { UnitTypeService } from '../services/unit-type.service';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateUnitTypeDto, UpdateUnitTypeDto } from '../dto/unit-type.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'organizationId',
  createDto: CreateUnitTypeDto,
  updateDto: UpdateUnitTypeDto,
};

@Controller('unit-type')
@ApiTags('unit-type')
export class UnitTypeController extends ExtraCrudController<UnitType>(options) {
  constructor(private readonly permissionService: UnitTypeService) {
    super(permissionService);
  }
}
