import { Controller } from '@nestjs/common';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { CreateRfxItemDocumentDto } from '../dtos/rfx-document.dto';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import { RfxDocumentaryEvidenceService } from '../services/rfx-documentary-evidence.service';
import {
  CreateRfxDocumetaryEvidenceDto,
  UpdateRfxDocumetaryEvidenceDto,
} from '../dtos/rfx-documentary-evidence.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxDocumetaryEvidenceDto,
  updateDto: UpdateRfxDocumetaryEvidenceDto,
};

@Controller('rfx-documentary-evidences')
@ApiTags('Rfx Documentary Evidence')
export class RfxDocumentaryEvidenceController extends ExtraCrudController<RfxDocumentaryEvidence>(
  options,
) {
  constructor(
    private readonly rfxDocumentaryEvidenceService: RfxDocumentaryEvidenceService,
  ) {
    super(rfxDocumentaryEvidenceService);
  }
}
