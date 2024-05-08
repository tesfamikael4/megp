import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MeasurementService } from '../service/measurement.service';
import {
  CreateMeasurementDto,
  UpdateMeasurementDto,
} from '../dto/measurement.dto';
import { Measurement } from 'src/entities/measurement.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
const options: EntityCrudOptions = {
  createDto: CreateMeasurementDto,
  updateDto: UpdateMeasurementDto,
};
@Controller('measurements')
@ApiTags(' measurements')
export class MeasurementController extends EntityCrudController<Measurement>(
  options,
) {
  constructor(private readonly measurementService: MeasurementService) {
    super(measurementService);
  }
  @Post()
  async createUniqueData(@Body() measurementDto: CreateMeasurementDto) {
    return await this.measurementService.createUniqueMeasurement(
      measurementDto,
    );
  }

  @Get(':id/with-uoms')
  async getMeasurementWithUoms(@Param('id') id: string): Promise<Measurement> {
    return await this.measurementService.getMeasurementWithUoms(id);
  }
}
