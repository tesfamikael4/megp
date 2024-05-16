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
  IsrVendorsEntity,
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
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { BusinessCategories } from 'src/modules/handling/enums/business-category.enum';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import { PaymentReceiptCommand } from '../dto/payment-command.dto';

@Injectable()
export class InvoiceService extends EntityCrudService<InvoiceEntity> {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorsRepository: Repository<VendorsEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly srRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    private readonly pricingService: ServicePricingService,
    private readonly commonService: HandlingCommonService,
    private readonly baService: BusinessAreaService,
    private readonly bpService: BusinessProcessService,
  ) {
    super(invoiceRepository);
  }

  async updateStatus(dto: PaymentReceiptCommand) {
    const invoice = await this.invoiceRepository.findOne({
      where: { refNumber: dto.referenceNo },
    });
    if (invoice && dto.status == 'Success') {
      invoice.paymentStatus = PaymentStatus.COMPLETED;
      this.invoiceRepository.update(invoice.id, invoice);
    } else {
    }
  }

  async generateNewregistrationInvoice(
    businesses: CreateAreasOfBusinessInterest[],
    user: any,
  ) {
    try {
      const priceRangeIds = businesses.map((item) => item.priceRange);
      const vendor = await this.vendorsRepository.findOne({
        where: { userId: user.id },
      });
      if (!vendor) {
        throw new HttpException('Register as  Vendor', 4040);
      }
      let regenerateInvoice = false;
      let draftedBAs = [];
      const serviceBp = await this.bpService.findBpWithServiceByKey(
        ServiceKeyEnum.NEW_REGISTRATION,
      );
      if (!serviceBp)
        throw new NotFoundException('Business Process Not Defined');
      const previousInvoice = await this.getMyInvoice(
        user.id,
        ServiceKeyEnum.NEW_REGISTRATION,
      );
      if (previousInvoice) {
        draftedBAs =
          await this.baService.getUserInprogressBusinessAreasByServiceId(
            serviceBp.serviceId,
            user.id,
          );

        for (const ba of businesses) {
          // if (previousInvoice.paymentDetail.filter((item) => item.category == ba.category).length == 0) {
          //   regenerateInvoice = true;
          //   break;
          // }
          if (
            draftedBAs.filter((item) => item.priceRangeId == ba.priceRange)
              .length == 0
          ) {
            regenerateInvoice = true;
            break;
          }
        }
        if (regenerateInvoice) {
          await this.invoiceRepository.delete(previousInvoice.id);
          await this.generateInvoice(priceRangeIds, vendor, user);
        } else {
          throw new HttpException('Invoice already generated', 400);
        }
      }
      const registeredServices =
        await this.baService.getVendorRegisteredServices(vendor.id);
      //check the service existence in the preouse approved services
      for (const row of businesses) {
        if (registeredServices.some((item) => item.category == row.category)) {
          return new HttpException('invalid Request', 400);
        }
      }
      const bas = [];
      const areaOfBisunessInterests = [];
      for (const row of businesses) {
        const ba = new BusinessAreaEntity();
        ba.category = row.category;
        const drafted = draftedBAs.find(
          (item) => item.category == row.category,
        );
        if (drafted) {
          ba.id = drafted.id;
        }
        ba.vendorId = vendor.id;
        ba.serviceId = serviceBp.serviceId;
        ba.priceRangeId = row.priceRange;
        ba.status = ApplicationStatus.PENDING;
        bas.push(ba);
        areaOfBisunessInterests.push({
          category: row.category,
          priceRange: row.priceRange,
          lineOfBusiness: row.lineOfBusiness,
        });
      }

      if (bas.length) {
        const isrvendor = await this.srRepository.findOne({
          where: { id: vendor.id },
        });
        const previousBA = isrvendor.areasOfBusinessInterest;
        isrvendor.areasOfBusinessInterest = [...areaOfBisunessInterests, ...previousBA];
        await this.srRepository.update(
          isrvendor.id,
          isrvendor,
        );
        await this.baService.create(bas);
        await this.generateInvoice(priceRangeIds, vendor, user);
        return HttpStatus.ACCEPTED;
      }
      return HttpStatus.BAD_REQUEST;
    } catch (error) {
      return new Error(error);
    }
  }
  async generateInvoice(
    currentPriceRangeIds: string[],
    vendor: VendorsEntity,
    user: any,
  ): Promise<boolean> {
    const curruntPricings =
      await this.pricingService.findPricingWithServiceByIds(
        currentPriceRangeIds,
      );
    if (curruntPricings.length == 0) {
      throw new NotFoundException('Not Found, please set the price range');
    }
    let totalFee = 0;
    const paymentDetail: any = [];
    for (const item of curruntPricings) {
      totalFee = totalFee + Number(item.fee);
      const formatedBC = this.commonService.formatPriceRange(item);
      paymentDetail.push({
        name: item.service.name,
        category: item.businessArea,
        bc: formatedBC,
        fee: item.fee,
      });
    }
    const priceRange = curruntPricings[0];
    // const service = curruntPricings.service;
    const invoice: InvoiceEntity = this.mapInvoice(
      //  priceRange,
      vendor,
      priceRange.service,
      user,
    );
    invoice.amount = totalFee;

    invoice.refNumber = this.commonService.generateRandomString(10);
    invoice.paymentDetail = [...paymentDetail];
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
  async getInvoiceActiveById(invoceId: string): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoceId, paymentStatus: PaymentStatus.PENDING },
    });

    return invoice;
  }
  async getInvoicesByUserAndService(
    userId: string,
    serviceId: string,
  ): Promise<InvoiceEntity> {
    const result = await this.invoiceRepository.findOne({
      where: { userId: userId, serviceId: serviceId },
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
        createdOn: MoreThanOrEqual(oneWeekAgo),
        service: {
          key: In(serviceTypes),
        },
      },
      relations: { service: { businessAreas: true } },
    });
    response.total = total;
    for (const row of result) {
      const invoice = InvoiceResponseDto.toResponse(row);
      response.items.push(invoice);
    }
    return response;
  }

  ////updated invoice
  async getMyInvoice(
    userId: string,
    serviceType: string,
  ): Promise<InvoiceEntity> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(new Date().getDate() - 7);
    const result = await this.invoiceRepository.findOne({
      where: {
        userId: userId,
        createdOn: MoreThanOrEqual(oneWeekAgo),
        paymentStatus: PaymentStatus.PENDING,
        service: {
          key: serviceType,
        },
      },
      relations: { service: true },
    });
    if (result) delete result.service;
    return result;
  }
  async getInvoiceByUser(userId: string, serviceId: string): Promise<InvoiceEntity> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(new Date().getDate() - 7);
    const result = await this.invoiceRepository.findOne({
      where: {
        userId: userId,
        createdOn: MoreThanOrEqual(oneWeekAgo),
        paymentStatus: In([PaymentStatus.PENDING, PaymentStatus.PAID]),
        serviceId: serviceId
      },
      relations: { service: true },
    });
    if (result) delete result.service;
    return result;
  }

  async getServiceReceipt(
    userId: string,
    serviceId: string,
  ): Promise<InvoiceEntity> {
    const result = await this.invoiceRepository.findOne({
      where: {
        userId: userId,
        serviceId: serviceId,
        paymentStatus: PaymentStatus.PAID,
        service: { businessAreas: { status: Not(ApplicationStatus.APPROVED) } },
      },
      relations: { service: { businessAreas: { BpService: true } } },
    });
    // const invoice = InvoiceResponseDto.toResponse(result);
    return result;
  }

  async generateRenewalInvoice(businessAreaIds: string[], user: any) {
    const bcs = [
      BusinessCategories.GOODS,
      BusinessCategories.WORKS,
      BusinessCategories.SERVICES,
    ];
    try {
      const businessAreas = businessAreaIds;
      const businessareasData = await this.businessAreaRepository.find({
        where: { id: In(businessAreas), status: ApplicationStatus.APPROVED },
        relations: { BpService: true, servicePrice: true },
      });

      if (businessareasData.length == 0)
        throw new HttpException('You have no approved service', 404);
      const vendor = await this.vendorsRepository.findOne({
        where: { id: businessareasData[0].vendorId },
      });

      const businessAreasNew_ = await this.businessAreaRepository.find({
        relations: { BpService: true },
        where: {
          vendorId: vendor.id,
          BpService: { key: ServiceKeyEnum.REGISTRATION_RENEWAL },
          status: ApplicationStatus.PENDING,
          category: In(bcs),
        },
      });
      let invoice_ = null;
      if (businessAreasNew_.length > 0) {
        const serviceId = businessAreasNew_[0].serviceId;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(new Date().getDate() - 7);
        invoice_ = await this.invoiceRepository.findOne({
          where: {
            serviceId: serviceId,
            userId: user.id,
            paymentStatus: PaymentStatus.PENDING,
            createdOn: MoreThanOrEqual(oneWeekAgo),
          },
        });
        if (invoice_.paymentDetail.length == businessAreaIds.length) {
          return { messaage: 'Invoice already Created', state: 'success' };
        } else {
          await this.invoiceRepository.remove(invoice_.id);
        }
      }

      const bp: BusinessProcessEntity =
        await this.bpService.findBpWithServiceByKey(
          ServiceKeyEnum.REGISTRATION_RENEWAL,
        );
      let totalFee = 0;
      const paymentDetail: any = [];
      for (const ba of businessareasData) {
        const price = await this.pricingService.getRenewalPrice(
          ba,
          ServiceKeyEnum.REGISTRATION_RENEWAL,
        );
        if (!price) throw new HttpException('Renewal Price not set', 404);
        totalFee = totalFee + Number(price.fee);
        const formatedBC = this.commonService.formatPriceRange(price);
        paymentDetail.push({
          name: price.service.name,
          category: price.businessArea,
          bc: formatedBC,
          fee: price.fee,
          pricingId: price.id,
          businessAreaId: ba.id,
        });
        const business: BusinessAreaEntity = new BusinessAreaEntity();
        business.status = PaymentStatus.PENDING;
        business.businessAreaState = ba.businessAreaState;
        business.instanceId = ba.instanceId;
        business.vendorId = ba.vendorId;
        business.category = ba.category;
        business.serviceId = bp.serviceId;
        business.priceRangeId = price.id;
        await this.baService.create(business);
      }
      const invoice: InvoiceEntity = this.mapInvoice(vendor, bp.service, user);
      if (paymentDetail.length > 0) {
        invoice.paymentDetail = [...paymentDetail];
        invoice.refNumber = this.commonService.generateRandomString(10);
        invoice.amount = totalFee;
        await this.invoiceRepository.save(invoice);
        const response = { messaage: 'Invoice Created', state: 'success' };
        return response;
      } else {
        throw new HttpException('Invioice Cannot generated', 400);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async generateUpgradeInvoice(businessArea: UpgradeInfoDTO, user: any) {
    try {
      const paymentDetail: any = [];
      let totalFee = 0;
      const vendor = await this.vendorsRepository.findOne({
        where: { userId: user.id },
      });
      const bp: BusinessProcessEntity =
        await this.bpService.findBpWithServiceByKey(
          ServiceKeyEnum.REGISTRATION_UPGRADE,
        );
      for (const ba of businessArea.upgrades) {
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
            BpService: {
              invoices: { userId: user.id, serviceId: bp.serviceId },
              key: ServiceKeyEnum.REGISTRATION_UPGRADE,
            },
          },
          relations: { BpService: { invoices: true }, servicePrice: true },
        });

        if (businessAreaNew) {
          if (businessAreaNew.priceRangeId == businessAreaData.priceRangeId) {
            continue;
          }
        }
        const CurrentpricingData =
          await this.pricingService.findPricingWithServiceById(newPricingId);
        const upgradePayment = this.computingPaymentForUpgrade(
          businessAreaData,
          CurrentpricingData,
        );
        totalFee = totalFee + Number(upgradePayment);
        const formatedBC =
          this.commonService.formatPriceRange(CurrentpricingData);
        paymentDetail.push({
          name: bp.service.name,
          category: CurrentpricingData.businessArea,
          bc: formatedBC,
          fee: upgradePayment,
        });
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
        await this.baService.create(business);
      }
      if (paymentDetail.length > 0) {
        const invoice: InvoiceEntity = this.mapInvoice(
          vendor,
          bp.service,
          user,
        );
        invoice.paymentDetail = [...paymentDetail];
        invoice.amount = totalFee;
        invoice.refNumber = this.commonService.generateRandomString(10);
        await this.invoiceRepository.save(invoice);
        const response = { messaage: 'Invoice Created', state: 'success' };
        return response;
      }
      throw new HttpException('invoice not generated', 400);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  mapInvoice(
    //curruntPricing: ServicePrice,
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
    //invoice.pricingId = curruntPricing.id;
    // invoice.amount = curruntPricing.fee;
    invoice.serviceId = service.id;
    invoice.payerName = vendor.name;
    invoice.userId = user.id;
    // invoice.serviceName = service.name;
    invoice.remark = 'invoice for ' + service.name;
    // invoice.reference = this.commonService.generateRandomString(10)
    return invoice;
  }
  async remove(id: string) {
    this.invoiceRepository.delete({ id: id });
  }
  async getInvoiceByIds(ids: string[]) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: In(ids),
        service: { businessProcesses: { isActive: true } },
      },
      relations: {
        service: {
          businessProcesses: true,
        },
      },
    });
    return invoice;
  }
}
