import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @Get('evidences-with-vendors/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getEvidencesWithVendors(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxDocumentaryEvidenceService.getEvidencesWithVendors(
      rfxId,
      user,
      query,
    );
  }
}
