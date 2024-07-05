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
import { AllowAnonymous, CurrentUser, JwtGuard } from 'src/shared/authorization';
import { UpgradeInfoDTO } from '../dto/vendor-upgrade.dto';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import axios from 'axios';
import {
  PaymentCommand,
  PaymentReceiptCommand,
} from '../dto/payment-command.dto';
import { BusinessInterestAreaDto } from '../dto/AdditionalService.dto';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';

@Controller('invoices')
@ApiTags('Invoices')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class InvoicesController {
  constructor(private invoiceService: InvoiceService, private commonService: HandlingCommonService) { }
  @Post('pay-online/:invoiceId')
  async payOnline(@CurrentUser() user: any, @Param('invoiceId') invoiceId: string) {
    const PaymentGateway =
      process.env.MEGP_PAYMENT_GATEWAY ?? 'https://dev-bo.megp.peragosystems.com/infrastructure/api/';
    const url = PaymentGateway + 'mpgs-payments';
    const invoice = await this.invoiceService.getActiveInvoiceById(invoiceId);
    if (invoice?.paymentStatus == PaymentStatus.PENDING) {
      const payload = new PaymentCommand();
      payload.invoiceReference = invoice.refNumber;
      //payload.status = "Pending";
      payload.currency = 'MWK';
      payload.applicationKey = 'Vendor';
      payload.amount = Number(invoice.amount);
      payload.service = invoice.remark;
      payload.description = invoice.refNumber;
      const vendorBaseURL = process.env.VENDOR_API_DEV ?? '/vendors/api'
      const callBackUrl = vendorBaseURL + '/invoices/update-payment-status';
      payload.callbackUrl = callBackUrl;
      const headers = {
        'Content-Type': 'application/json',
        // 'x-api-key': process.env.MEGP_PAYMENT_GATEWAY_API_KEY ?? 'qywteqajdfhasdfagsdhfasdfkdfgdkfg',
      };
      try {
        let response;
        if (!invoice.paymentLink) {
          response = await axios.post(url, payload, { headers });
        } else {
          invoice.refNumber = this.commonService.generateRandomString(10);
          await this.invoiceService.update(invoice.id, invoice);
          payload.invoiceReference = invoice.refNumber;
          response = await axios.post(url, payload, { headers });
        }

        console.log('response-----', response);
        if (response?.status === 201) {
          const responseData = response.data;
          invoice.paymentLink = response.data.paymentLink;
          invoice.paymentMethod = "Electronic";
          await this.invoiceService.update(invoice.id, invoice);
          return responseData;
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error making API request' + error);
      }

    } else {
      throw new NotFoundException('Invoice Not found');
    }
  }
  //under construction
  //will be updated latter
  @Get('pay-offline/:invoiceId')
  async payOffline(@CurrentUser() user: any, @Param('invoiceId') invoiceId: string) {
    const PaymentGateway =
      process.env.MEGP_PAYMENT_GATEWAY ?? 'https://dev-bo.megp.peragosystems.com/infrastructure/api/';

    const invoice = await this.invoiceService.getActiveInvoiceById(invoiceId);
    if (invoice) {
      const invoiceReference = invoice.refNumber;
      //25bc1622e5fb42cca3d3e62e90a3a20f
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MEGP_PAYMENT_GATEWAY_API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f',
      };

      try {
        const url = `${PaymentGateway}offline-payments/${invoiceReference}`;
        const response = await axios.get(url, { headers: headers });
        console.log('response-----', response);
        if (response.status === 200) {
          const responseData = JSON.stringify(response.data);
          invoice.paymentStatus = PaymentStatus.PAID;
          invoice.remark = responseData,
            await this.invoiceService.update(invoice.id, invoice);
          return responseData;
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error making API request' + error);
      }
    } else {
      throw new NotFoundException('Invoice Not found');
    }
  }

  //open for testing purpose only 
  @AllowAnonymous()
  @Post('update-payment-status')
  async updateStatus(@Body() receipt: PaymentReceiptCommand) {
    return this.invoiceService.updateStatus(receipt);
  }

  @Post('generate-new-registration-invoice')
  async generateNewRegistrationInvoice(
    @Body() businessesInterestArea: BusinessInterestAreaDto,
    @CurrentUser() user: any,
  ) {
    if (businessesInterestArea.areasOfBusinessInterest?.length > 0) {
      const result = await this.invoiceService.generateNewRegistrationInvoice(
        businessesInterestArea,
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
