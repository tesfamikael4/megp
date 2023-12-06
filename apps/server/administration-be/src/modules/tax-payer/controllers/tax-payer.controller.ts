import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TaxPayerService } from '../services/tax-payer.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaxPayer } from '@entities';
import { DataResponseFormat } from '@api-data';
import { EntityCrudController } from '@generic-controllers';
import { TinValidation } from '../dto/tin-validation.model';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateTaxPayerDto, UpdateTaxPayerDto } from '../dto/tax-payer.dto';
const options: EntityCrudOptions = {
  createDto: CreateTaxPayerDto,
  updateDto: UpdateTaxPayerDto,
};
@Controller('tax-payers')
@ApiTags('MRA')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class TaxPayersController extends EntityCrudController<TaxPayer>(
  options,
) {
  constructor(private readonly taxPayerService: TaxPayerService) {
    super(taxPayerService);
  }

  @Post('bulk-save')
  async createTaxPayers(
    @Body() taxPayerDtos: TinValidation,
  ): Promise<TaxPayer[]> {
    return this.taxPayerService.createBulkyData(taxPayerDtos);
  }

  @Get(':tin/:issuedDate')
  @ApiOperation({
    summary: 'Get User Information By TIN and Issued Date',
    description:
      'Retrieve user information by providing the Tax Identification Number (TIN) and Issued Date.',
  })
  @ApiParam({
    name: 'tin',
    type: String,
    description: 'Tax Identification Number (TIN) of the user',
  })
  @ApiParam({
    name: 'issuedDate',
    type: Date,
    description: 'Date when the user information was issued',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tax payer information',
    type: TaxPayer,
  })
  @ApiResponse({ status: 404, description: 'Tax Payer not found' })
  async getUserByTinAndIssuedDate(
    @Param('tin') tin: string,
    @Param('issuedDate') issuedDate: Date,
  ) {
    return this.taxPayerService.getVenderByTinAndIssuedDate(tin, issuedDate);
  }
}
