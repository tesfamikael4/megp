import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
import {
  GetTraderInfoDto,
  TraderDataValidation,
} from '../dto/trader-data-validation';
import { EntityCrudController } from '@generic-controllers';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateCustomerBussinesInfoDto,
  UpdateCustomerBussinesInfoDto,
} from '../dto/customer-business-info.dto';
import { AllowAnonymous, ApiKeyGuard } from 'src/shared/authorization';

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
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  async getTraderInfoByTinAndTradeLicenseNumber(
    @Param() params: GetTraderInfoDto,
  ) {
    return this.customerBussinesInfoService.getTraderInfoByTinAndTradeLicenseNumber(
      params.tin,
      params.licenseNumber,
    );
  }
  @Get(':registration_number')
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @ApiParam({ name: 'registration_number', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully return the Supplier Information from MBRS',
  })
  async getSupplierInfoFromMBRS(
    @Param('registration_number') registrationNumber: string,
  ) {
    if (!registrationNumber) {
      throw new Error('Registration number is mandatory');
    }
    try {
      const businesses =
        await this.customerBussinesInfoService.getSupplierInfoFromMBRS(
          registrationNumber,
        );
      return businesses;
    } catch (error) {
      return { error: error.message };
    }
  }
}
