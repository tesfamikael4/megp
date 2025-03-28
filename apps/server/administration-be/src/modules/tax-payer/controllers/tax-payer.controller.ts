import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TaxPayerService } from '../services/tax-payer.service';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxPayer } from '@entities';
import { DataResponseFormat } from '@api-data';
import { EntityCrudController } from '@generic-controllers';
import {
  GetUserByTinAndIssuedDateDto,
  TinValidation,
} from '../dto/tin-validation.model';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateTaxPayerDto, UpdateTaxPayerDto } from '../dto/tax-payer.dto';
import { AllowAnonymous, ApiKeyGuard } from 'src/shared/authorization';
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
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  async getUserByTinAndIssuedDate(
    @Param('tin') tin: string,
    @Param('issuedDate') issuedDate: string,
  ) {
    return this.taxPayerService.getVenderByTinAndIssuedDate(tin, issuedDate);
  }
}
