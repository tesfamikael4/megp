import { Controller, Get, Param } from '@nestjs/common';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RfxItemDocument } from 'src/entities';
import { RfxItemDocumentService } from '../services/rfx-item-document.service';
import { CreateRfxItemDocumentDto } from '../dtos/rfx-document.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxItemDocumentDto,
};

@Controller('rfx-item-documents')
@ApiTags('Rfx Item Documents')
export class RfxItemDocumentController extends ExtraCrudController<RfxItemDocument>(
  options,
) {
  constructor(
    private readonly rfxItemDocumentServiceService: RfxItemDocumentService,
  ) {
    super(rfxItemDocumentServiceService);
  }

  @Get('download/:id')
  async downloadDocument(@Param('id') id: string) {
    return this.rfxItemDocumentServiceService.downloadDocument(id);
  }
}
