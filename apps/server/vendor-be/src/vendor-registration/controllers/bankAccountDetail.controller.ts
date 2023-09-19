import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { VendorsBankDto } from '../dto/bank-vendor.dto';
import { BankAccountDetailService } from '../services/bankAccountDetail.service';
import { BankDto } from '../dto/bank.dto';
import { CollectionQuery } from 'src/shared/collection-query';

//@ApiBearerAuth()
@Controller('BankAccountDetail')
@ApiTags('BankAccountDetail')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BankAccountDetailController {
  constructor(private readonly bankService: BankAccountDetailService) {}
  @Get('fetch-bank-account-details')
  async fetch(@Query() query: CollectionQuery) {
    return await this.bankService.fetch(query);
  }
  @Get('fetch-bank')
  async fetchBank(@Query() query: CollectionQuery) {
    return await this.bankService.fetchBank(query);
  }
  @Get('fetch-bank-byId/:bankId')
  async fetchBankById(@Param('bankId') bankId: string) {
    return await this.bankService.getBankById(bankId);
  }
  @Get('fetch-bank-detail-byId/:bankDetailId')
  async fetchBankDetailById(@Param('bankDetailId') bankDetailId: string) {
    return await this.bankService.getBankById(bankDetailId);
  }
  @Get('fetch-bank-detail-byId/:VendorId')
  async fetchBankDetailByVendorId(
    @Param('VendorId') VendorId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.bankService.getBankAccountDetailByVendorId(
      VendorId,
      query,
    );
  }
  @Post('add-bank')
  async addBank(@Body() bank: BankDto) {
    return await this.bankService.createBank(bank);
  }
  @Post('add-bank')
  async addBankw(@Body() bank: BankDto) {
    return await this.bankService.createBank(bank);
  }
  @Post('add-bankdetails')
  async addBankDetails(@Body() bank: BankDto) {
    return await this.bankService.createBank(bank);
  }
  @Post('add-bank')
  async addBankDetail(@Body() bank: VendorsBankDto) {
    return await this.bankService.createBankDetail(bank);
  }
  @Post('delete-bank-detail/:bankDetailId')
  async deleteBankDetail(@Param('bankDetailId') bankDetailId: string) {
    return await this.bankService.deleteBankDetail(bankDetailId);
  }
  @Post('delete-bank/:bankId')
  async deleteBank(@Param('bankId') bankId: string) {
    return await this.bankService.deleteBank(bankId);
  }
  @Post('update-bank/:bankId')
  async updateBank(@Body() bankDto: BankDto, @Param('bankId') bankId: string) {
    bankDto.id = bankId;
    return await this.bankService.updateBank(bankDto);
  }
  @Post('update-bank-detail/:bankDetailId')
  async updateBankDetail(
    @Body() bankDto: VendorsBankDto,
    @Param('bankDetailId') bankDetailId: string,
  ) {
    bankDto.id = bankDetailId;
    return await this.bankService.updateBankDetail(bankDto);
  }
}
