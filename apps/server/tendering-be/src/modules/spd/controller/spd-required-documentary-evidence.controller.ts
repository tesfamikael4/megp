import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdRequiredDocumentaryEvidence } from 'src/entities/spd-required-documentary-evidence.entity';
import { SpdRequiredDocumentaryEvidenceService } from '../service/spd-required-documentary-evidence.service';
import {
  CreateSpdRequiredDocumentaryEvidencesDto,
  UpdateSpdRequiredDocumentaryEvidencesDto,
} from '../dto/spd-required-documentary-evidence.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdRequiredDocumentaryEvidencesDto,
  updateDto: UpdateSpdRequiredDocumentaryEvidencesDto,
};
@ApiBearerAuth()
@Controller('spd-required-documentary-evidences')
@ApiTags('Spd-Required-Documentary-Evidences')
export class SpdRequiredDocumentaryEvidencesController extends EntityCrudController<SpdRequiredDocumentaryEvidence>(
  options,
) {
  constructor(
    private readonly spdRequiredDocumentaryEvidencesService: SpdRequiredDocumentaryEvidenceService,
  ) {
    super(spdRequiredDocumentaryEvidencesService);
  }
}
