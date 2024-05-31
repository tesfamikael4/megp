import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
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
  @ApiOperation({
    summary: 'Get the vendor attached document on evaluation step',
  })
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
}
