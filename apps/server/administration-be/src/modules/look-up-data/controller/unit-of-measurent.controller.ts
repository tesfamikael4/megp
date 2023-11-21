import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { UnitOfMeasurementService } from '../service/unit-of-measurement.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateUnitOfMeasurementDto,
  UpdateUnitOfMeasurementDto,
} from '../dto/uom.dto';
import { ExtraCrudController } from 'src/shared/controller';
const options: ExtraCrudOptions = {
  entityIdName: 'measurementId',
  createDto: CreateUnitOfMeasurementDto,
  updateDto: UpdateUnitOfMeasurementDto,
};
@Controller('extra-unit-of-measurements')
@ApiTags('extra unit of measurements')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class UnitOfMeasurementController extends ExtraCrudController<UnitOfMeasurement>(
  options,
) {
  constructor(private readonly uomService: UnitOfMeasurementService) {
    super(uomService);
  }
}
