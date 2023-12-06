import { Controller } from '@nestjs/common';
import {
  CreateProcurementThresholdDto,
  UpdateProcurementThresholdDto,
} from '../dto/procurement-threshold.dto';
import { ProcurementThresholdService } from '../services/procurement-threshold.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { ProcurementThreshold } from '@entities';
import { EntityCrudController } from '@generic-controllers';

const options: EntityCrudOptions = {
  createDto: CreateProcurementThresholdDto,
  updateDto: UpdateProcurementThresholdDto,
};
@Controller('procurement-thresholds')
@ApiTags('procurement-thresholds')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ProcurementThresholdsController extends EntityCrudController<ProcurementThreshold>(
  options,
) {
  constructor(
    private readonly procurementThresholdService: ProcurementThresholdService,
  ) {
    super(procurementThresholdService);
  }
}
