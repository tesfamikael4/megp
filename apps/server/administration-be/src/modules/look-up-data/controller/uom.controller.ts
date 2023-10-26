import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { UnitOfMeasurementService } from '../service/uom.service';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { CreateUnitOfMeasurementDto } from '../dto/uom.dto';
@ExtraCrudDecorator({
  entityIdName: 'measurementId',
})
@Controller('unit-of-measurements')
@ApiTags(' unit of measurements')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class UnitOfMeasurementController extends ExtraCrudController<UnitOfMeasurement> {
  constructor(private readonly uomService: UnitOfMeasurementService) {
    super(uomService);
  }
}
