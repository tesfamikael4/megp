import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { UpgradeInfoDTO } from '../dto/vendor-upgrade.dto';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';

@Controller('invoices')
@ApiTags('Invoices')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class InvoicesController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('get-my-upgrade-invoice')
  async getMyInvoice(@CurrentUser() userInfo: any) {
    const serviceKeys = [
      ServiceKeyEnum.servicesUpgrade,
      ServiceKeyEnum.goodsUpgrade,
      ServiceKeyEnum.worksUpgrade,
    ];
    return await this.invoiceService.getMyActiveInvoices(
      userInfo.id,
      serviceKeys,
    );
  }

  @Post('generate-renewal-invoice')
  async generateRenewalInvoice(
    @Body() businessAreaIds: string[],
    @CurrentUser() user: any,
  ) {
    if (businessAreaIds.length > 0) {
      return await this.invoiceService.generateRenewalInvoice(
        businessAreaIds,
        user,
      );
    } else {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-my-renewal-invoice')
  async getMyRenewalInvoice(@CurrentUser() userInfo: any) {
    const serviceKeys = [
      ServiceKeyEnum.servicesRenewal,
      ServiceKeyEnum.goodsRenewal,
      ServiceKeyEnum.worksRenewal,
    ];
    return await this.invoiceService.getMyActiveInvoices(
      userInfo.id,
      serviceKeys,
    );
  }
  @Post('generate-upgrade-invoice')
  async generateServiceInvoiceForUpgrade(
    @CurrentUser() userInfo: any,
    @Body() businessArea: UpgradeInfoDTO,
  ) {
    return await this.invoiceService.generateUpgradeInvoice(
      businessArea,
      userInfo,
    );
  }

  @Get('get-invoices')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @ApiPaginatedResponse(InvoiceResponseDto)
  async fetchInvoices(@Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.invoiceService.getInvoices(query);
  }
  @UseGuards(JwtGuard)
  @Get('get-invoice/:id')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getInvoice(@Param('id') id: string) {
    return await this.invoiceService.getInvoice(id);
  }
}
