import { Controller } from '@nestjs/common';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import { RfxDocumentaryEvidenceService } from '../services/rfx-documentary-evidence.service';
import {
  CreateRfxContractTermDto,
  UpdateRfxContractTermDto,
} from '../dtos/rfx-contract-term.dto';
import { RfxContractTerm } from 'src/entities';
import { RfxContractTermService } from '../services/rfx-contract-term.service';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxContractTermDto,
  updateDto: UpdateRfxContractTermDto,
};

@Controller('rfx-contract-terms')
@ApiTags('Rfx Contract Terms')
export class RfxDocumentaryEvidenceController extends ExtraCrudController<RfxContractTerm>(
  options,
) {
  constructor(private readonly rfxContractTermService: RfxContractTermService) {
    super(rfxContractTermService);
  }
}
