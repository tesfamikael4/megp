import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';

import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

import { ExtraCrudController } from 'src/shared/controller';
import { GuaranteeRelease } from 'src/entities/guarantee-release.entity';
import {
  CreateGuaranteeReleaseDto,
  UpdateGuaranteeReleaseDto,
} from '../dtos/guarantee-release.dto';
import { GuaranteeReleaseService } from '../services/guarantee-release.service';
const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateGuaranteeReleaseDto,
  updateDto: UpdateGuaranteeReleaseDto,
};
@Controller('guarantee-releases')
@ApiTags('guarantee releases')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeReleaseController extends ExtraCrudController<GuaranteeRelease>(
  options,
) {
  constructor(
    private readonly guaranteeReleaseService: GuaranteeReleaseService,
  ) {
    super(guaranteeReleaseService);
  }
}
