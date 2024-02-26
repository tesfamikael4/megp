import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BpServiceEntity,
  BusinessAreaEntity,
  InvoiceEntity,
  ServicePrice,
  VendorsEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import {
  Equal,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { DateRange } from '../dto/report.dto';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wfiRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepositoty: Repository<VendorsEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepositoy: Repository<InvoiceEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly baRepository: Repository<BusinessAreaEntity>,
    private readonly commonService: HandlingCommonService,
  ) { }
  ///Not ompleted yet
  async getApplicationsByStatus(dateRange: DateRange): Promise<any[]> {
    const formattedResult = [];
    const result = await this.wfiRepository
      .createQueryBuilder('wfi')
      .select([
        'service.name',
        'ba.status',
        'COUNT(wfi.applicationNumber) AS InstanceCount',
      ])
      .innerJoin(BpServiceEntity, 'service', 'service.id = wfi.serviceId')
      .innerJoin(BusinessAreaEntity, 'ba', 'ba.serviceId = service.id')
      .groupBy('service.name')
      .addGroupBy('ba.status')
      .where('wfi.submittedAt', MoreThanOrEqual(dateRange.fromDate))
      .andWhere('wfi.updatedAt', LessThanOrEqual(dateRange.toDate))
      .getRawMany();

    const serviceNames = [...new Set(result.map((item) => item.service_name))];
    for (const name of serviceNames) {
      const newobject = { name: name, approved: 0, onProgress: 0, rejected: 0 };
      for (const item of result) {
        let column: string = item.ba_status;
        column = column.toLowerCase();
        if (item.service_name == name) {
          if (item.ba_status == ApplicationStatus.OUTDATED) continue;
          if (item.ba_status == ApplicationStatus.PENDING)
            column = 'inprogress';

          newobject[column] = item.instancecount;
        }
      }

      formattedResult.push(newobject);
    }
    return formattedResult;
  }

  async getVendorsByLocation(where: any): Promise<any> {
    const result = await this.vendorRepositoty
      .createQueryBuilder('vendor')
      .select([
        'vendor.country country',
        'ba.category category',
        'sp.valueFrom valueFrom',
        'sp.valueTo valueTo',
        'COUNT(vendor.country) as count',
      ])
      .innerJoin(BusinessAreaEntity, 'ba', 'ba.vendorId = vendor.id')
      .innerJoin(ServicePrice, 'sp', 'sp.id = ba.priceRangeId')
      .where('ba.status =:status', { status: ApplicationStatus.APPROVED })
      .andWhere('ba.category In(:...categories)', {
        categories: ['goods', 'services', 'works'],
      })
      .groupBy('vendor.country')
      .addGroupBy('ba.category')
      .addGroupBy('sp.valueFrom')
      .addGroupBy('sp.valueTo')
      .getRawMany();
    return result;
  }
  async getVendorByFinancialClass() {
    const categories = ['services', 'goods', 'works'];
    const result = await this.vendorRepositoty
      .createQueryBuilder('v')
      .select([
        'ba.category category',
        'price.valueFrom "valueFrom"',
        'price.valueTo "valueTo"',
        'COUNT(ba.priceRangeId) count',
      ])
      .leftJoin(BusinessAreaEntity, 'ba', 'v.id=ba.vendorId')
      .leftJoin(ServicePrice, 'price', 'price.id=ba.priceRangeId')
      .where('ba.status=:status', { status: ApplicationStatus.APPROVED })
      .andWhere('v.status=:status', { status: ApplicationStatus.APPROVED })
      .andWhere('ba.category In(:...categories)', { categories: categories })
      .groupBy('ba.category')
      .addGroupBy('price.valueFrom')
      .addGroupBy('price.valueTo')
      .getRawMany();
    const formattedResult = [];
    for (const row of result) {
      const range = this.commonService.formatPriceRange(row);
      const formattedRow = { ...row, range: range };
      formattedResult.push(formattedRow);
    }
    return formattedResult;
  }

  async getDashboardReport() {
    const dashboard = {
      activeVendors: 0,
      approvedApps: 0,
      rejectedApps: 0,
      inprogressApps: 0,
      debardVendors: 0,
      upgrades: 0,
      renewals: 0,
      ibm: 0,
      small: 0,
      medium: 0,
      macro: 0,
      marginalizedGroup: 0,
    };
    dashboard.activeVendors = await this.countActiveVendors();
    const apps = await this.countApplicationsByStatus();
    dashboard.approvedApps = apps.Approved;
    dashboard.inprogressApps = apps.Pending;
    dashboard.rejectedApps = apps.Rejected;
    dashboard.debardVendors = await this.countDebardVendors();
    dashboard.upgrades = await this.countUpgradesOrRenewals(
      ServiceKeyEnum.upgrade,
    );
    dashboard.renewals = await this.countUpgradesOrRenewals(
      ServiceKeyEnum.RENEWAL,
    );
    const preferentials = await this.countPreferentials(
      ServiceKeyEnum.PREFERENCTIAL,
    );
    const dashbordwhole = {
      ...dashboard,
      ...preferentials,
    };
    return dashbordwhole;
  }
  async countActiveVendors() {
    return await this.baRepository.count({
      where: { status: ApplicationStatus.APPROVED },
    });
  }
  async countApplicationsByStatus() {
    const result = await this.baRepository
      .createQueryBuilder('ba')
      .select(['status', 'COUNT(status) count'])
      .where('ba.status In(:...statuses)', {
        statuses: [
          ApplicationStatus.APPROVED,
          ApplicationStatus.REJECTED,
          ApplicationStatus.PENDING,
        ],
      })
      .groupBy('ba.status')
      .getRawMany();
    const statuCount = {
      Approved: 0,
      Rejected: 0,
      Pending: 0,
    };

    for (const row of result) {
      statuCount[row.status] = row.count;
    }
    return statuCount;
  }
  async countPreferentials(serviceGroup: string) {
    const keys = this.commonService.getServiceCatagoryKeys(serviceGroup);
    const result = await this.baRepository
      .createQueryBuilder('ba')
      .select(['service.key key', 'COUNT(key) count'])
      .leftJoin(BpServiceEntity, 'service', 'service.id=ba.serviceId')
      .where('ba.status=:status', { status: ApplicationStatus.APPROVED })
      .andWhere('service.key In(:...keys)', { keys: keys })
      .groupBy('service.key')
      .getRawMany();
    const ptCount = {
      ibm: 0,
      small: 0,
      medium: 0,
      macro: 0,
      marginalizedGroup: 0,
    };
    for (const row of result) {
      let index = row.key.toLowerCase();
      if (row.key == 'Marginalized_Group') index = 'marginalizedGroup';
      ptCount[index] = row.count;
    }
    return ptCount;
  }
  async countDebardVendors() {
    return await this.vendorRepositoty.count({
      where: {
        status: VendorStatusEnum.DEBARD,
      },
    });
  }
  async countUpgradesOrRenewals(serviceClass: string) {
    const keys = this.commonService.getServiceCatagoryKeys(serviceClass);
    const result = await this.baRepository
      .createQueryBuilder('ba')
      .select(['ba.status status', 'COUNT(status) count'])
      .leftJoin(BpServiceEntity, 'service', 'service.id=ba.serviceId')
      .where('ba.status =:status', { status: ApplicationStatus.APPROVED })
      .andWhere('service.key In(:...keys)', { keys: keys })
      .groupBy('ba.status')
      .getRawMany();
    if (result.length > 0) return result[0].count;
    return 0;
  }

  async getAvarageTime(dateRange: DateRange) {
    const totalApps = await this.wfiRepository.count({ where: { status: ApplicationStatus.COMPLETED, submittedAt: MoreThanOrEqual(dateRange.fromDate), updatedAt: LessThanOrEqual(dateRange.toDate) } })
    const result = await this.wfiRepository.createQueryBuilder('wfi')
      .select(['SUM(EXTRACT(MINUTE FROM (wfi."updatedAt"::timestamp - wfi."submittedAt"::timestamp))) AS hour_difference',
      ])
      .where('wfi.status =:status', { status: ApplicationStatus.COMPLETED })
      .andWhere('wfi.submittedAt >=:submittedAt', { submittedAt: dateRange.fromDate })
      .andWhere('wfi.updatedAt <=:updatedAt', { updatedAt: dateRange.toDate })
      .groupBy('wfi.status')
      .getRawMany()
    if (result.length > 0) {
      const avarageMinutes = Number(result[0].hour_difference) / Number(totalApps);
      const { days, hours, minutes: remainingMinutes } = this.commonService.convertMinutesToDaysHoursMinutes(avarageMinutes);
      return `${days} days, ${hours} hours, and ${remainingMinutes} minutes`;
    }

    return `${0} days, ${0} hours, and ${0} minutes`;

  }
  async getRevenue(range: DateRange) {
    const result = await this.invoiceRepositoy
      .createQueryBuilder('invoice')
      .select(['invoice.serviceName name', 'SUM(invoice.amount) amount'])
      .leftJoin(BpServiceEntity, 'service', 'service.id=invoice.serviceId')
      .where('invoice.paymentStatus=:status', { status: PaymentStatus.PAID })
      .andWhere('invoice.createdOn >=:createdOn', { createdOn: range.fromDate })
      .andWhere('invoice.updatedAt <=:updatedAt', { updatedAt: range.toDate })
      .groupBy('invoice.serviceName')
      .getRawMany();

    return result;
  }

  async getVendorDiversityByBusinessForm() {
    const result = await this.vendorRepositoty.createQueryBuilder('v')
      .select(['v.formOfEntity formOfEntity', 'COUNT(v.formOfEntity) count'])
      .groupBy('v.formOfEntity')
      .getRawMany();
    let totalVendors = 0;
    for (const row of result) {
      totalVendors = Number(totalVendors) + Number(row.count);
    }
    const resultWithPercent = result.map((item) => {
      return { ...item, percentage: (item.count / totalVendors) * 100 };
    })

    return resultWithPercent;

  }
  async getVendorsByCategory() {
    const categories = ['services', 'goods', 'works'];
    const result = await this.baRepository
      .createQueryBuilder('ba')
      .select(['ba.category category', 'COUNT(ba.category) count'])
      .where('ba.status=:status', { status: ApplicationStatus.APPROVED })
      .andWhere('ba.category In(:...categories)', { categories: categories })
      .groupBy('ba.category')
      .getRawMany();
    return result;
  }

}
