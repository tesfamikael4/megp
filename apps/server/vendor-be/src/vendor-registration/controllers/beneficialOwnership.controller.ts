import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { BeneficialOwnershipService } from '../services/beneficialOwnership.service';

//@ApiBearerAuth()
@Controller('BeneficialOwnershipController')
@ApiTags('BeneficialOwnershipController')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BeneficialOwnershipController {
  constructor(
    private readonly beneficialOwnershipController: BeneficialOwnershipService,
  ) {}
  @Get('fetch')
  async fetch() {
    return await this.beneficialOwnershipController.fetch();
  }
  @Get('get-beneficial-ownership-by-id/:Id')
  async getBeneficialOwnershipById(@Param('Id') Id: string) {
    return await this.beneficialOwnershipController.getBeneficialOwnershipById(
      Id,
    );
  }
  @Get('get-beneficial-ownership-by-vendorId/:vendorId')
  async getBeneficialOwnershipVendorId(@Param('VendorId') VendorId: string) {
    return await this.beneficialOwnershipController.getBeneficialOwnershipByVendorId(
      VendorId,
    );
  }
}
