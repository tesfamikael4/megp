import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
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
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import axios from 'axios';
import { PaymentCommand, PaymentReceiptCommand } from '../dto/payment-command.dto';

@Controller('invoices')
@ApiTags('Invoices')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class InvoicesController {
  constructor(private invoiceService: InvoiceService) {


  }
  @Post('pay')
  async pay(@CurrentUser() user: any, @Param('invoiceId') invoiceId: string) {
    const PaymentGateway = process.env.MEGP_PAYMENT_GATEWAY ?? '/infrastructure/api/';
    const url = PaymentGateway + '/mpgs-payments';
    const invoice = await this.invoiceService.getInvoiceActiveById(invoiceId);
    if (invoice) {
      const payload = new PaymentCommand();
      payload.invoiceReference = invoice.refNumber;
      payload.currency = 'MWK';
      payload.applicationKey = 'Vendor';
      payload.amount = invoice.amount;
      payload.callbackUrl = '';
      const headers = {
        'Content-Type': 'application/json',
        // 'x-api-key': process.env.MEGP_PAYMENT_GATEWAY_API_KEY ?? 'qywteqajdfhasdfagsdhfasdfkdfgdkfg',
      };
      try {
        const response = await axios.post(url, payload, { headers });
        console.log('response-----', response);
        if (response.status === 201) {
          const responseData = response.data;
          return responseData;
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error making API request' + error);
      }
    } else {
      throw new NotFoundException("Invoice Not found");
    }
  }
  @Post('update-payment-status')
  async updateStatus(@Body() receipt: PaymentReceiptCommand) {
    return this.invoiceService.updateStatus(receipt);
  }

  @Post('generate-new-registration-invoice')
  async generateNewRegistrationInvoice(
    @Body() businesses: CreateAreasOfBusinessInterest[],
    @CurrentUser() user: any,
  ) {
    if (businesses.length > 0) {
      const result = await this.invoiceService.generateNewregistrationInvoice(
        businesses,
        user,
      );
      if (result) return HttpStatus.CREATED;
      else {
        throw new HttpException('Invoice not created', 400);
      }
    } else {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
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
  @Get('get-my-upgrade-invoice')
  async getMyInvoice(@CurrentUser() userInfo: any) {

    return await this.invoiceService.getMyInvoice(
      userInfo.id,
      ServiceKeyEnum.REGISTRATION_UPGRADE,
    );
  }
  @Get('get-my-renewal-invoice')
  async getMyRenewalInvoice(@CurrentUser() userInfo: any) {
    return await this.invoiceService.getMyInvoice(
      userInfo.id,
      ServiceKeyEnum.REGISTRATION_RENEWAL,
    );
  }
  @Get('get-my-registration-invoice')
  async getMyRegistrationInvoice(@CurrentUser() userInfo: any) {
    return await this.invoiceService.getMyInvoice(
      userInfo.id,
      ServiceKeyEnum.NEW_REGISTRATION,
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
