import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { GuaranteeExtension } from 'src/entities/guarantee-extension.entity';
import {
  CreateGuaranteeExtensionDto,
  UpdateGuaranteeExtensionDto,
} from '../dtos/guarantee-extension.dto';
import { GuaranteeExtensionService } from '../services/guarantee-extension.service';
const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateGuaranteeExtensionDto,
  updateDto: UpdateGuaranteeExtensionDto,
};
@Controller('guarantee-extensions')
@ApiTags('guarantee extensions')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeExtensionController extends ExtraCrudController<GuaranteeExtension>(
  options,
) {
  constructor(
    private readonly guaranteeExtensionService: GuaranteeExtensionService,
  ) {
    super(guaranteeExtensionService);
  }
}
