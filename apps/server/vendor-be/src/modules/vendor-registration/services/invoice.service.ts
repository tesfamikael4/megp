import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InvoiceEntity,
  TaskHandlerEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import { ServiceKeyEnum } from 'src/modules/handling/dto/workflow-instance.enum';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { InvoiceResponseDto } from '../dto/invoice.dto';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';

@Injectable()
export class InvoiceService extends EntityCrudService<InvoiceEntity> {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly pricingService: ServicePricingService,
  ) {
    super(invoiceRepository);
  }

  async generateInvoice(
    pricingId: string,
    user: any,
    vendor: any,
  ): Promise<boolean> {
    const result = await this.pricingService.findPricingWithServiceById(
      pricingId,
    );
    if (!result) {
      throw new NotFoundException('Not Found, please set the price range');
    }
    const invoice = new InvoiceEntity();
    const service = result.service;
    //if th service is upgrade

    if (service.key == ServiceKeyEnum.upgrade) {
      await this.generateInvoiceForUpgrade();
    } else {
      invoice.amount = result.fee;
    }
    invoice.instanceId = null; //result.instanceId;
    invoice.taskName = null; //result.task.name;
    invoice.taskId = null; //result.task.id;
    invoice.payToAccName =
      'Public Procurement and Disposal of Assets Authority';
    invoice.payToAccNo = '000 100 562 4416';
    invoice.payToBank = 'National Bank of Malawi';
    invoice.pricingId = pricingId;
    //invoice.applicationNo = result.workflowInstance.applicationNumber;
    //  const basicObject: any = JSON.parse(JSON.stringify(vendor.basic));
    invoice.payerName = vendor.name;
    invoice.userId = user.id;
    invoice.serviceId = result.service.id;
    invoice.serviceName = service.name;
    invoice.remark = result.businessArea + ' ,' + service.description;
    invoice.paymentStatus = 'Pending';
    invoice.createdOn = new Date();
    const response = await this.invoiceRepository.insert(invoice);
    if (response) return true;
    return false;
  }
  async generateInvoiceForUpgrade() {
    /*
                    const previousPayment = await this.workflowInstanceRepository.findOne({
                        relations: {
                            businessProcess: { service: true },
                            price: true,
                        },
                        where: {
                            businessProcess: { service: { key: ServiceKeyEnum.new } },
                            status: WorkflowInstanceEnum.Completed,
                            //  approvedAt: Not(IsNull()),
                            price: { businessArea: result.businessArea },
                            // requestorId: result.workflowInstance.requestorId,
                        },
                    });
        
                    if (previousPayment) {
                        /*
                        if (previousPayment.price.fee < price.fee) {
                          const netpayment = await this.computeUpgradeServicePaymentAmount(previousPayment, result);
                          invoice.amount = netpayment;
                        }
                    } else {
                        throw new NotFoundException('Something went wrong');
                    }
                    */
  }
  async computeUpgradeServicePaymentAmount(
    previousPayment: WorkflowInstanceEntity,
    taskhandler: TaskHandlerEntity,
  ): Promise<number> {
    /* const previousFeeRate = previousPayment.price.fee / 365;
         const proposedPaymentRate = taskhandler.workflowInstance.price.fee / 365;
         const datesLeftToExpire = this.commonService.ComputeDateDifference(
           new Date(),
           new Date(previousPayment.expireDate),
         );
         const unUtilizedMoney = Number(datesLeftToExpire) * previousFeeRate;
         const expectedFeeForNewLevel =
           proposedPaymentRate * Number(datesLeftToExpire);
         const netPaymnetForUpgrade = expectedFeeForNewLevel - unUtilizedMoney;
         return netPaymnetForUpgrade;
         */
    return 1;
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
      where: { instanceId: instanceId, taskId: taskId },
    });
    console.log('invoice', invoice);
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
    userId: string,
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
}
