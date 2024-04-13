import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdDocumentaryEvidence } from 'src/entities';
import {
  CreateSpdDocumentaryEvidenceDto,
  UpdateSpdDocumentaryEvidenceDto,
} from '../dto';
import { SpdDocumentaryEvidenceService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdDocumentaryEvidenceDto,
  updateDto: UpdateSpdDocumentaryEvidenceDto,
};

@ApiBearerAuth()
@Controller('spd-documentary-evidences')
@ApiTags('Spd Documentary Evidences')
export class SpdDocumentaryEvidenceController extends EntityCrudController<SpdDocumentaryEvidence>(
  options,
) {
  constructor(
    private readonly spdDocumentaryEvidenceService: SpdDocumentaryEvidenceService,
  ) {
    super(spdDocumentaryEvidenceService);
  }
}
