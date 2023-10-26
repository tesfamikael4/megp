import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { MeasurementService } from '../service/measurement.service';
import {
  CreateMeasurementDto,
  UpdateMeasurementDto,
} from '../dto/measurement.dto';
import { CollectionQuery } from 'src/shared/collection-query';
import { Measurement } from 'src/entities/measurement.entity';

@Controller('measurements')
@ApiTags(' measurements')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class MeasurementController extends EntityCrudController<Measurement> {
  constructor(private readonly measurementService: MeasurementService) {
    super(measurementService);
  }
}
