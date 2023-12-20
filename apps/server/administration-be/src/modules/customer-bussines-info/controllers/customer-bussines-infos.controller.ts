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
  async getTraderInfoByTinAndTradeLicenseNumber(
    @Param() params: GetTraderInfoDto,
  ) {
    return this.customerBussinesInfoService.getTraderInfoByTinAndTradeLicenseNumber(
      params.tin,
      params.licenseNumber,
    );
  }
}
