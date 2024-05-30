import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
  AllowAnonymous,
} from 'megp-shared-be';
import { SolResponse } from 'src/entities';
import { SolResponseService } from '../services/response.service';
import {
  CreateSolResponseDto,
  UpdateSolResponseDto,
} from '../dtos/response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateSolResponseDto,
  updateDto: UpdateSolResponseDto,
};

@ApiBearerAuth()
@Controller('sol-responses')
@ApiTags('Sol Response')
export class SolResponseController extends ExtraCrudController<SolResponse>(
  options,
) {
  constructor(private readonly rfxRepsonseItemService: SolResponseService) {
    super(rfxRepsonseItemService);
  }

  @Get('document/:rfxId/:rfxDocumentaryEvidenceId/:solRegistrationId')
  async getDocument(
    @Param('rfxId') rfxId: string,
    @Param('rfxDocumentaryEvidenceId') rfxDocumentaryEvidenceId: string,
    @Param('solRegistrationId') solRegistrationId: string,
  ) {
    return this.rfxRepsonseItemService.getDocument(
      rfxId,
      rfxDocumentaryEvidenceId,
      solRegistrationId,
    );
  }

  @Get('responses/:rfxId/:vendorId')
  @AllowAnonymous()
  async reviewResonses(
    @Param('rfxId') rfxId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.rfxRepsonseItemService.reviewResonses(rfxId, vendorId);
  }

  @Get('opened-response/:rfxDocumentaryEvidenceId/:vendorId')
  async openedResponse(
    @Param('rfxDocumentaryEvidenceId') rfxDocumentaryEvidenceId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.rfxRepsonseItemService.getOpenResponseByEvidenceId(
      rfxDocumentaryEvidenceId,
      vendorId,
    );
  }
}
