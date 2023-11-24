import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomerBussinesInfoService } from '../services/customer-bussines-info.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerBussinesInfo } from '@entities';
import { DataResponseFormat } from '@api-data';
import { TraderDataValidation } from '../dto/trader-data-validation';
import { EntityCrudController } from '@generic-controllers';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateCustomerBussinesInfoDto } from '../dto/create-customer-bussines-info.dto';
import { UpdateCustomerBussinesInfoDto } from '../dto/update-customer-bussines-info.dto';
const options: EntityCrudOptions = {
  createDto: CreateCustomerBussinesInfoDto,
  updateDto: UpdateCustomerBussinesInfoDto,
};
@Controller('customer-bussines-infos')
@ApiTags('MBRS')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class CustomerBussinesInfosController extends EntityCrudController<CustomerBussinesInfo>(
  options,
) {
  constructor(
    private readonly customerBussinesInfoService: CustomerBussinesInfoService,
  ) {
    super(customerBussinesInfoService);
  }

  @Post('bulk-save')
  async createTraders(
    @Body() dto: TraderDataValidation,
  ): Promise<CustomerBussinesInfo[]> {
    return this.customerBussinesInfoService.createBulkyData(dto);
  }

  @Get(':tin/:licenseNumber')
  @ApiOperation({
    summary: 'Get Trader Information By Tin And Trade License number',
    description:
      'Retrieve trader information by providing the Tax Identification Number (TIN) and Trade License Number.',
  })
  @ApiParam({
    name: 'tin',
    type: String,
    required: true,
    description: 'Tax Identification Number (TIN) of the trader',
  })
  @ApiParam({
    name: 'licenseNumber',
    type: String,
    required: true,
    description: 'Trade License Number of the trader',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved trader information',
    type: CustomerBussinesInfo,
  })
  @ApiResponse({ status: 404, description: 'Trader Information not found' })
  async getTraderInfoByTinAndTradeLicenseNumber(
    @Param('tin') tin: string,
    @Param('licenseNumber') licenseNumber: string,
  ) {
    return this.customerBussinesInfoService.getTraderInfoByTinAndTradeLicenseNumber(
      tin,
      licenseNumber,
    );
  }
}
