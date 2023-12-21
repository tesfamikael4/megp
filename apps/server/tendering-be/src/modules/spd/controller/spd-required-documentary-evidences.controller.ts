import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdRequiredDocumentaryEvidences } from 'src/entities/spd-required-documentary-evidences.entity';
import { SpdRequiredDocumentaryEvidencesService } from '../service/spd-required-documentary-evidences.service';
import {
  CreateSpdRequiredDocumentaryEvidencesDto,
  UpdateSpdRequiredDocumentaryEvidencesDto,
} from '../dto/spd-required-documentary-evidences.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdRequiredDocumentaryEvidencesDto,
  updateDto: UpdateSpdRequiredDocumentaryEvidencesDto,
};
@ApiBearerAuth()
@Controller('spd-required-documentary-evidences')
@ApiTags('Spd-Required-Documentary-Evidences')
export class SpdRequiredDocumentaryEvidencesController extends EntityCrudController<SpdRequiredDocumentaryEvidences>(
  options,
) {
  constructor(
    private readonly spdRequiredDocumentaryEvidencesService: SpdRequiredDocumentaryEvidencesService,
  ) {
    super(spdRequiredDocumentaryEvidencesService);
  }
}
