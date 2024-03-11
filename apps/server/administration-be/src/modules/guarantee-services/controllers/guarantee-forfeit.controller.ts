import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreateGuaranteeReleaseDto,
  UpdateGuaranteeReleaseDto,
} from '../dtos/guarantee-release.dto';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';
import { GuaranteeForfeitService } from '../services/guarantee-forfeit.service';
const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateGuaranteeReleaseDto,
  updateDto: UpdateGuaranteeReleaseDto,
};
@Controller('guarantee-forfeits')
@ApiTags('guarantee forfeits')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeForfeitController extends ExtraCrudController<GuaranteeForfeit>(
  options,
) {
  constructor(
    private readonly guaranteeForfeitService: GuaranteeForfeitService,
  ) {
    super(guaranteeForfeitService);
  }
}
