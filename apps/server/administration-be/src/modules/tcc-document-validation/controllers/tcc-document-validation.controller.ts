import { Controller, Get, Param } from '@nestjs/common';
import { TccDocumentValidationService } from '../services/tcc-document-validation.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tcc-document-validation')
@ApiTags('TCC')
@ApiResponse({ status: 500, description: 'Internal error' })
export class TccDocumentValidationController {
  constructor(
    private readonly tccDocumentValidationService: TccDocumentValidationService,
  ) {}

  @Get(':value')
  @ApiOperation({
    summary: 'Get User Information By Document Id',
    description: 'Retrieve user information by providing the Document Id.',
  })
  @ApiParam({
    name: 'value',
    type: String,
    description: 'Document Id of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tax payer information',
  })
  @ApiResponse({ status: 404, description: 'Tax Payer not found' })
  async validateTaxPayer(@Param('value') value: string) {
    const result =
      await this.tccDocumentValidationService.getTaxpayerCertificateByValidationCode(
        value,
      );
    return result;
  }
}
