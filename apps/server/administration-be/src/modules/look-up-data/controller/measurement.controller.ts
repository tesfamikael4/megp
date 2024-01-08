import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
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
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class MeasurementController extends EntityCrudController<Measurement>(
  options,
) {
  constructor(private readonly measurementService: MeasurementService) {
    super(measurementService);
  }
  @Post()
  async createUniqueData(@Body() measurementDto: CreateMeasurementDto) {
    return await this.measurementService.createUniqueData(measurementDto);
  }
}
