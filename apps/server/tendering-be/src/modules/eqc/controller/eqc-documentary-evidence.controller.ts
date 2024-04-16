import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcDocumentaryEvidence } from 'src/entities';
import {
  CreateEqcDocumentaryEvidenceDto,
  UpdateEqcDocumentaryEvidenceDto,
} from '../dto';
import { EqcDocumentaryEvidenceService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateEqcDocumentaryEvidenceDto,
  updateDto: UpdateEqcDocumentaryEvidenceDto,
};

@ApiBearerAuth()
@Controller('eqc-documentary-evidences')
@ApiTags('Eqc Documentary Evidences')
export class EqcDocumentaryEvidenceController extends ExtraCrudController<EqcDocumentaryEvidence>(
  options,
) {
  constructor(
    private readonly eqcDocumentaryEvidenceService: EqcDocumentaryEvidenceService,
  ) {
    super(eqcDocumentaryEvidenceService);
  }
}
