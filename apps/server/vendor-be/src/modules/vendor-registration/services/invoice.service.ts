import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BpServiceEntity,
  BusinessAreaEntity,
  BusinessProcessEntity,
  InvoiceEntity,
  ServicePrice,
  VendorsEntity,
} from 'src/entities';

import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudService } from 'src/shared/service';
import { In, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { BusinessAreaService } from './business-area.service';
import { UpgradeInfoDTO } from '../dto/vendor-upgrade.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';

@Injectable()
export class InvoiceService extends EntityCrudService<InvoiceEntity> {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorsRepository: Repository<VendorsEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    private readonly pricingService: ServicePricingService,
    private readonly commonService: HandlingCommonService,
    private readonly baService: BusinessAreaService,
    private readonly bpService: BusinessProcessService,
  ) {
    super(invoiceRepository);
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
    invoice.refNumber = this.commonService.generateRandomString(7);
    const response = await this.invoiceRepository.save(invoice);
    if (response) return true;
    return false;
  }
  async generateInvoiceForRenewal(
    curruntPricing: ServicePrice,
    vendor: any,
    user: any,
  ): Promise<boolean> {
    const invoice: InvoiceEntity = this.mapInvoice(
      curruntPricing,
      vendor,
      curruntPricing.service,
      user,
    );
    invoice.refNumber = this.commonService.generateRandomString(7);
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
    invoice.refNumber = this.commonService.generateRandomString(7);
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
        console.log('expire date', datesLeftToExpire);
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

  async getInvoice(invoceId: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoceId },
    });
    if (invoice) {
      return InvoiceResponseDto.toResponse(invoice);
    }
    return null;
  }

  async getInvoicesUserAndService(userId: string): Promise<InvoiceEntity[]> {
    const result = await this.invoiceRepository.find({
      where: { userId: userId, paymentStatus: 'Paid' },
    });

    return result;
  }

  ////updated invoice
  async getMyActiveInvoices(
    userId: string,
    serviceTypes: string[],
  ): Promise<DataResponseFormat<InvoiceResponseDto>> {
    const response = new DataResponseFormat<InvoiceResponseDto>();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(new Date().getDate() - 7);
    const [result, total] = await this.invoiceRepository.findAndCount({
      where: {
        userId: userId,
        //paymentStatus: 'Pending',
        createdOn: MoreThanOrEqual(oneWeekAgo),
        businessArea: {
          status: Not(ApplicationStatus.APPROVED),
          BpService: { key: In(serviceTypes) },
        },
      },
      relations: { businessArea: { BpService: true } },
    });
    response.total = total;
    const invoices = [];
    for (const row of result) {
      if (row.businessArea.status != ApplicationStatus.APPROVED) {
        const invoice = InvoiceResponseDto.toResponse(row);
        invoices.push(invoice);
      }
    }
    response.items = [...invoices];
    return response;
  }
  async getServiceReceipt(
    userId: string,
    serviceId: string,
  ): Promise<InvoiceResponseDto> {
    const result = await this.invoiceRepository.findOne({
      where: {
        userId: userId,
        serviceId: serviceId,
        paymentStatus: PaymentStatus.PAID,
        businessArea: { status: Not(ApplicationStatus.APPROVED) },
      },
      relations: { businessArea: { BpService: true } },
    });
    const invoice = InvoiceResponseDto.toResponse(result);
    return invoice;
  }

  async generateRenewalInvoice(businessAreaIds: string[], user: any) {
    let isInvoiceExist = false;
    try {
      const keys = [];
      const businessAreas = businessAreaIds;
      const businessareasData = await this.businessAreaRepository.find({
        where: { id: In(businessAreas), status: ApplicationStatus.APPROVED },
        relations: { BpService: true, servicePrice: true },
      });
      const baInstanceIds: string[] = businessareasData.map(
        (row) => row.instanceId,
      );
      const busnessAreasNew = await this.businessAreaRepository.find({
        where: {
          status: ApplicationStatus.PENDING,
          instanceId: In(baInstanceIds),
          invoice: { userId: user.id },
        },
        relations: { BpService: true, servicePrice: true, invoice: true },
      });

      for (const ba of businessareasData) {
        const serviceKey: string = await this.commonService.mapServiceType(
          ba,
          'renewal',
        );
        keys.push(serviceKey);
        const price = await this.pricingService.getRenewalPrice(ba, serviceKey);
        if (busnessAreasNew.length > 0) {
          for (const row of busnessAreasNew) {
            if (row.instanceId == ba.instanceId) {
              isInvoiceExist = true;
              break;
            }
          }
        }
        if (isInvoiceExist) {
          continue;
        }
        const bp: BusinessProcessEntity =
          await this.bpService.findBpWithServiceByKey(serviceKey);
        const vendor = await this.vendorsRepository.findOne({
          where: { id: ba.vendorId },
        });

        const invoice: InvoiceEntity = this.mapInvoice(
          price,
          vendor,
          price.service,
          user,
        );
        const business: BusinessAreaEntity = new BusinessAreaEntity();
        business.serviceId = bp.serviceId;
        business.priceRangeId = price.id;
        business.status = PaymentStatus.PENDING;
        business.businessAreaState = ba.businessAreaState;
        business.instanceId = ba.instanceId;
        business.vendorId = ba.vendorId;
        business.category = ba.category;
        const result = await this.baService.create(business);
        if (result) {
          invoice.businessAreaId = result.id;
          await this.invoiceRepository.save(invoice);
        }
      }
      const response = { messaage: 'Invoice Created', state: 'success' };
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async generateUpgradeInvoice(businessArea: UpgradeInfoDTO, user: any) {
    try {
      const keys = [];
      const newBAIds = [];
      for (let index = 0; index < businessArea.upgrades.length; index++) {
        const ba = businessArea.upgrades[index];
        const bAId = ba.id;
        const newPricingId = ba.pricingId;
        const businessAreaData = await this.businessAreaRepository.findOne({
          where: { id: bAId, status: ApplicationStatus.APPROVED },
          relations: { BpService: true, servicePrice: true },
        });
        const businessAreaNew = await this.businessAreaRepository.findOne({
          where: {
            status: ApplicationStatus.PENDING,
            instanceId: businessAreaData?.instanceId,
            invoice: { userId: user.id },
          },
          relations: { BpService: true, servicePrice: true, invoice: true },
        });

        if (businessAreaNew) {
          if (businessAreaNew.priceRangeId == businessAreaData.priceRangeId) {
            newBAIds.push(businessAreaNew.id);
            continue;
          } else {
            const invoiceId = businessAreaNew.invoice.id;
            await this.invoiceRepository.delete(invoiceId);
          }
        }
        const key = await this.commonService.mapServiceType(
          businessAreaData,
          'upgrade',
        );
        keys.push(key);
        const CurrentpricingData =
          await this.pricingService.findPricingWithServiceById(newPricingId);
        const upgradePayment = this.computingPaymentForUpgrade(
          businessAreaData,
          CurrentpricingData,
        );
        const bp: BusinessProcessEntity =
          await this.bpService.findBpWithServiceByKey(key);
        const vendor = await this.vendorsRepository.findOne({
          where: { id: businessAreaData.vendorId },
        });
        const invoice: InvoiceEntity = this.mapInvoice(
          CurrentpricingData,
          vendor,
          bp.service,
          user,
        );

        invoice.amount = upgradePayment;
        invoice.businessAreaId = ba.id;
        const business: BusinessAreaEntity = new BusinessAreaEntity();
        business.serviceId = bp.serviceId;
        business.priceRangeId = newPricingId;
        business.status = ApplicationStatus.PENDING;
        businessArea.BusinessAreaStatus.level =
          businessArea.BusinessAreaStatus.level = 'Payment';
        business.businessAreaState = businessArea.BusinessAreaStatus;
        business.instanceId = businessAreaData.instanceId;
        business.vendorId = businessAreaData.vendorId;
        business.category = businessAreaData.category;
        business.expireDate = businessAreaData.expireDate;
        const result = await this.baService.create(business);
        if (result) {
          newBAIds.push(result.id);
          invoice.businessAreaId = result.id;
          await this.invoiceRepository.save(invoice);
        }
      }
      const response = { messaage: 'Invoice Created', state: 'success' };
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
    invoice.paymentStatus = PaymentStatus.PENDING;
    invoice.createdOn = new Date();
    invoice.pricingId = curruntPricing.id;
    invoice.amount = curruntPricing.fee;
    invoice.serviceId = service.id;
    invoice.payerName = vendor.name;
    invoice.userId = user.id;
    invoice.businessAreaId = null;
    invoice.serviceName = service.name;
    invoice.remark = 'invoice for ' + service.name;
    // invoice.reference = this.commonService.generateRandomString(8)
    return invoice;
  }
}
