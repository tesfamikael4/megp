import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BpServiceEntity,
  BusinessAreaEntity,
  InvoiceEntity,
  ServicePrice,
  VendorsEntity,
} from 'src/entities';
import { ServiceKeyEnum } from 'src/modules/handling/dto/workflow-instance.enum';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudService } from 'src/shared/service';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { BusinessAreaService } from './business-area.service';

@Injectable()
export class InvoiceService extends EntityCrudService<InvoiceEntity> {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly pricingService: ServicePricingService,
    private readonly commonService: HandlingCommonService,
    private readonly baService: BusinessAreaService,
  ) {
    super(invoiceRepository);
  }

  async generateInvoice2(
    currentPriceRange: string,
    vendor: VendorsEntity,
    businessArea: BusinessAreaEntity,
    user: any,
  ): Promise<boolean> {
    const curruntPricing =
      await this.pricingService.findPricingWithServiceById(currentPriceRange);

    if (!curruntPricing) {
      throw new NotFoundException('Not Found, please set the price range');
    }
    const invoice = new InvoiceEntity();
    const service = curruntPricing.service;
    //if th service is upgrade

    if (service.key == ServiceKeyEnum.upgrade) {
      const baServicePrice = await this.baService.getBusinessAreaWithPrice(
        businessArea.id,
      );
      invoice.amount = this.computingPaymentForUpgrade(
        baServicePrice,
        curruntPricing,
      );
    } else {
      invoice.amount = curruntPricing.fee;
    }
    invoice.businessAreaId = null; //result.instanceId;
    invoice.taskName = null; //result.task.name;
    invoice.taskId = null; //result.task.id;
    invoice.payToAccName =
      'Public Procurement and Disposal of Assets Authority';
    invoice.payToAccNo = '000 100 562 4416';
    invoice.payToBank = 'National Bank of Malawi';
    invoice.pricingId = curruntPricing.id;
    //invoice.applicationNo = result.workflowInstance.applicationNumber;
    //  const basicObject: any = JSON.parse(JSON.stringify(vendor.basic));
    invoice.payerName = vendor.name;
    invoice.userId = user.id;
    invoice.serviceId = curruntPricing.service.id;
    invoice.serviceName = service.name;
    invoice.remark = curruntPricing.businessArea + ' ,' + service.description;
    invoice.paymentStatus = 'Pending';
    invoice.createdOn = new Date();
    const response = await this.invoiceRepository.save(invoice);
    if (response) return true;
    return false;
  }
  async generateInvoice(
    currentPriceRange: string,
    vendor: VendorsEntity,
    user: any,
  ): Promise<boolean> {
    const curruntPricing =
      await this.pricingService.findPricingWithServiceById(currentPriceRange);
    if (!curruntPricing) {
      throw new NotFoundException('Not Found, please set the price range');
    }
    const service = curruntPricing.service;
    const invoice: InvoiceEntity = this.mapInvoice(
      curruntPricing,
      vendor,
      service,
      user,
    );
    invoice.amount = curruntPricing.fee;
    invoice.payerName = vendor.name;
    const response = await this.invoiceRepository.save(invoice);
    if (response) return true;
    return false;
  }
  async generateInvoiceForUpgrade(
    currentPriceRange: string,
    vendor: any,
    businessArea: BusinessAreaEntity,
    user: any,
  ): Promise<boolean> {
    const curruntPricing =
      await this.pricingService.findPricingWithServiceById(currentPriceRange);
    const service = curruntPricing.service;
    const invoice: InvoiceEntity = this.mapInvoice(
      curruntPricing,
      vendor,
      service,
      user,
    );
    const baServicePrice = await this.baService.getBusinessAreaWithPrice(
      businessArea.id,
    );
    invoice.amount = this.computingPaymentForUpgrade(
      baServicePrice,
      curruntPricing,
    );
    const response = await this.invoiceRepository.save(invoice);
    if (response) return true;
    return false;
  }
  computingPaymentForUpgrade(
    ba: BusinessAreaEntity,
    curruntPricing: ServicePrice,
  ) {
    if (ba) {
      if (Number(ba.servicePrice.fee) < Number(curruntPricing.fee)) {
        const previousFeeRate = ba.servicePrice.fee / 365;
        const proposedPaymentRate = curruntPricing.fee / 365;
        const datesLeftToExpire = this.commonService.ComputeDateDifference(
          new Date(),
          new Date(ba.expireDate),
        );
        console.log("expire date", datesLeftToExpire);
        const unUtilizedMoney = Number(datesLeftToExpire) * previousFeeRate;
        const expectedFeeForNewLevel =
          proposedPaymentRate * Number(datesLeftToExpire);
        const netPaymnetForUpgrade = expectedFeeForNewLevel - unUtilizedMoney;
        return Number(netPaymnetForUpgrade.toFixed(2));
      } else {
        return 0;
      }
    }
  }

  async getInvoices(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const dataQuery = QueryConstructor.constructQuery<InvoiceEntity>(
      this.invoiceRepository,
      query,
    );
    const response = new DataResponseFormat<InvoiceResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        InvoiceResponseDto.toResponse(entity),
      );
    }
    return response;
  }

  async getInvoiceByInstanceId(
    instanceId: string,
    taskId: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { businessAreaId: instanceId, taskId: taskId },
    });
    if (invoice) {
      const invoicedto = InvoiceResponseDto.toResponse(invoice);
      return invoicedto;
    }
    return null;
  }
  async getInvoice(invoceId: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoceId },
    });
    if (invoice) {
      return InvoiceResponseDto.toResponse(invoice);
    }
    return null;
  }
  async getMyInvoices(
    userId: string, serviceId: string
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const response = new DataResponseFormat<InvoiceResponseDto>();
    const [result, total] = await this.invoiceRepository.findAndCount({
      where: { userId: userId, paymentStatus: 'Pending' },
    });
    response.total = total;
    response.items = result.map((entity) =>
      InvoiceResponseDto.toResponse(entity),
    );
    return response;
  }
  async getInvoicesUserAndService(
    userId: string
  ): Promise<InvoiceEntity[]> {
    const result = await this.invoiceRepository.find({
      where: { userId: userId, paymentStatus: 'Paid' },
    });

    return result;
  }
  async getActiveMyInvoices(
    userId: string,
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const response = new DataResponseFormat<InvoiceResponseDto>();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(new Date().getDate() - 7);
    const [result, total] = await this.invoiceRepository.findAndCount({
      where: {
        userId: userId,
        paymentStatus: 'Pending',
        createdOn: MoreThanOrEqual(oneWeekAgo),
      },
      relations: { businessArea: true }
    });
    response.total = total;
    response.items = result.map((entity) =>
      InvoiceResponseDto.toResponse(entity),
    );
    return response;
  }

  mapInvoice(
    curruntPricing: ServicePrice,
    vendor: VendorsEntity,
    service: BpServiceEntity,
    user: any,
  ): InvoiceEntity {
    const invoice = new InvoiceEntity();
    invoice.payToAccName =
      'Public Procurement and Disposal of Assets Authority';
    invoice.payToAccNo = '000 100 562 4416';
    invoice.payToBank = 'National Bank of Malawi';
    invoice.paymentStatus = 'Pending';
    invoice.createdOn = new Date();
    invoice.pricingId = curruntPricing.id;
    invoice.amount = curruntPricing.fee;
    invoice.serviceId = service.id;
    invoice.payerName = vendor.name;
    invoice.userId = user.id;
    invoice.businessAreaId = null; //result.instanceId;
    invoice.taskName = null; //result.task.name;
    invoice.taskId = null; //result.task.id;
    invoice.serviceName = service.name;
    invoice.remark = 'invoice for ' + service.name;
    // invoice.reference = this.commonService.generateRandomString(8)
    return invoice;
  }
}
