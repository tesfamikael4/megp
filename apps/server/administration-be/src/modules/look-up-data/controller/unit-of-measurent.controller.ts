import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { UnitOfMeasurementService } from '../service/unit-of-measurement.service';

@ExtraCrudDecorator({
    entityIdName: 'measurementId',
})
@Controller('extra-unit-of-measurements')
@ApiTags('extra unit of measurements')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class UnitOfMeasurementController extends ExtraCrudController<UnitOfMeasurement> {
    constructor(private readonly uomService: UnitOfMeasurementService) {
        super(uomService);
    }
}
