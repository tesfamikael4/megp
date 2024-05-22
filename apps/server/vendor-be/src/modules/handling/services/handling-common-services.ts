import { InjectRepository } from '@nestjs/typeorm';
import { BusinessAreaEntity, ServicePrice } from 'src/entities';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { BAEnum } from 'src/modules/vendor-registration/dto/business-area.enum';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { BusinessCategories } from '../enums/business-category.enum';
export class HandlingCommonService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wfiRepository: Repository<WorkflowInstanceEntity>,
  ) { }
  generateRandomString(length: number, prefix = '') {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charsLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charsLength));
    }
    return prefix.concat(result);
  }
  async generateApplicationNumber(orgCode: string, serviceCode: string) {
    const today = new Date();
    const dateFormatted = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );
    const shortDate =
      today.getFullYear().toString().slice(-2) +
      '' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '' +
      ('0' + today.getDate()).slice(-2);
    const wfiResult = await this.wfiRepository.count({
      where: { submittedAt: MoreThanOrEqual(dateFormatted) },
    });
    const applicationNo = orgCode.concat(
      '-',
      serviceCode,
      '-',
      shortDate,
      '-',
      (wfiResult + 1).toString(),
    );
    console.log(applicationNo);
    return applicationNo;
  }

  ComputeDateDifference(startDate: Date, endDate: Date) {
    const oneDay = 86400000; // 1000 * 60 * 60 * 24 ms;
    const startInTime = startDate.getTime();
    const endInTime = endDate.getTime();
    if (endInTime >= startInTime) {
      const result = (endInTime - startInTime) / oneDay;
      return result.toFixed(0);
    } else {
      const result = (startInTime - endInTime) / oneDay;
      return result.toFixed(0);
    }
  }

  async mapServiceType(
    businessAreaData: BusinessAreaEntity,
    operationType: string,
  ) {
    let key = '';
    if (operationType == 'renewal') {
      switch (businessAreaData.category) {
        case BAEnum.goods:
          key = ServiceKeyEnum.goodsRenewal;
          break;
        case BAEnum.works:
          key = ServiceKeyEnum.worksRenewal;
          break;
        case BAEnum.services:
          key = ServiceKeyEnum.servicesRenewal;
          break;
        default:
          break;
      }
    } else if (operationType == 'upgrade') {
      switch (businessAreaData.category) {
        case BAEnum.goods:
          key = ServiceKeyEnum.goodsUpgrade;
          break;
        case BAEnum.works:
          key = ServiceKeyEnum.worksUpgrade;
          break;
        case BAEnum.services:
          key = ServiceKeyEnum.servicesUpgrade;
          break;

        default:
          break;
      }
    }

    return key;
  }
  getServiceCatagoryKeys(serviceKey: string): string[] {
    let keys = [];

    if (serviceKey === ServiceKeyEnum.new) {
      keys = [
        ServiceKeyEnum.NEW_REGISTRATION,
        // ServiceKeyEnum.servicesNewRegistration,
        // ServiceKeyEnum.worksNewRegistration,
      ];
    } else if (serviceKey == ServiceKeyEnum.upgrade) {
      keys = [
        ServiceKeyEnum.REGISTRATION_UPGRADE,
        // ServiceKeyEnum.servicesUpgrade,
        // ServiceKeyEnum.worksUpgrade,
      ];
    } else if (serviceKey === ServiceKeyEnum.RENEWAL) {
      keys = [
        ServiceKeyEnum.REGISTRATION_RENEWAL,
        // ServiceKeyEnum.servicesRenewal,
        // ServiceKeyEnum.worksRenewal,
      ];
    } else if (serviceKey == ServiceKeyEnum.update) {
      keys = [ServiceKeyEnum.PROFILE_UPDATE];
    } else if (serviceKey == ServiceKeyEnum.PREFERENCTIAL) {
      keys = [
        ServiceKeyEnum.IBM,
        ServiceKeyEnum.MEDIUM,
        ServiceKeyEnum.SMALL,
        ServiceKeyEnum.MICRO,
        ServiceKeyEnum.MARGINALIZED_GROUP,
      ];
    } else if (serviceKey == ServiceKeyEnum.MSME) {
      keys = [
        ServiceKeyEnum.MEDIUM,
        ServiceKeyEnum.SMALL,
        ServiceKeyEnum.MICRO,
      ];
    } else if (serviceKey == ServiceKeyEnum.MG) {
      keys = [ServiceKeyEnum.MARGINALIZED_GROUP];
    }
    return keys;
  }

  getPreferentialServices() {
    return [
      ServiceKeyEnum.IBM,
      ServiceKeyEnum.MEDIUM,
      ServiceKeyEnum.SMALL,
      ServiceKeyEnum.MICRO,
      ServiceKeyEnum.MARGINALIZED_GROUP,
    ];
  }
  getUpgradeType(catogory: string) {
    if (BusinessCategories.GOODS.toLowerCase() == catogory) {
      return ServiceKeyEnum.goodsUpgrade;
    } else if (BusinessCategories.SERVICES.toLowerCase() == catogory) {
      return ServiceKeyEnum.servicesUpgrade;
    } else if (BusinessCategories.WORKS.toLowerCase() == catogory) {
      return ServiceKeyEnum.worksUpgrade;
    }
    return null;
  }
  monthDiff(expireDate: Date, today: Date): number {
    let months;
    months = (today.getFullYear() - expireDate.getFullYear()) * 12;
    months -= expireDate.getMonth();
    months += today.getMonth();
    return months;
  }
  formatPriceRange(priceRange: any) {
    let valueTo = '';
    let valueFrom = '';
    const curruncy = priceRange.currency ? priceRange.currency : 'MK'; //currency
    if (priceRange.valueFrom >= 1000000000) {
      valueFrom = (priceRange.valueFrom / 1000000000).toFixed(0);
      if (priceRange.valueTo >= 1000000000) {
        valueTo = (priceRange.valueTo / 1000000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' billion';
      }
      return 'Above ' + curruncy + valueFrom + ' billion ' + valueTo;
    } else if (priceRange.valueFrom >= 1000000) {
      if (priceRange.valueTo >= 1000000000) {
        valueTo = (priceRange.valueTo / 1000000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' billion';
      } else if (priceRange.valueTo >= 1000000) {
        valueTo = (priceRange.valueTo / 1000000).toFixed(0);
        valueTo = ' - ' + curruncy + valueTo + ' million';
      }
      const valueFrom = (priceRange.valueFrom / 1000000).toFixed(0);
      return 'Above ' + curruncy + valueFrom + ' million ' + valueTo;
    } else if (priceRange.valueFrom >= 1) {
      valueTo = (priceRange.valueTo / 1000000).toFixed(0);
      valueTo = curruncy + valueTo + ' million';
      return 'Up to ' + valueTo;
    }
    if (priceRange.valueFrom) return priceRange.valueFrom.toString();
    return '';
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  convertMinutesToDaysHoursMinutes(minutes: number): {
    days: number;
    hours: number;
    minutes: number;
  } {
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const remainingMinutes = minutes % 60;
    return {
      days: days,
      hours: hours,
      minutes: remainingMinutes,
    };
  }
  reduceAttributes(object: any) {
    const {
      id,
      key,
      tenantId,
      createdAt,
      deletedAt,
      updatedAt,
      vendorId,
      ...rest
    } = object;
    return rest;
  }
  formatBusinessArea(priceRanges: ServicePrice[], abis: any[]) {
    const formattedAreaOfBi = [];
    for (const price of priceRanges) {
      for (const bi of abis) {
        if (bi.priceRange == price.id) {
          const priceRange = this.formatPriceRange(price);
          const lob = bi.lineOfBusiness.map((item: any) => item.name);
          formattedAreaOfBi.push({
            category: bi.category,
            priceRange: priceRange,
            lineOfBusiness: lob,
            approvedAt: bi?.approvedAt,
            expireDate: bi?.expireDate,
            certificateUrl: bi?.certificateUrl,

          });
        }
      }
    }
    return formattedAreaOfBi;
  }
  orderAddress(address: any) {
    const orderedAddress = {
      physicalAddress: address.physicalAddress,
      postalAddress: address.postalAddress,
      primaryEmail: address.primaryEmail,
      alternateEmail: address.alternateEmail,
      region: address.region,
      district: address.district,
      telephone: address.telephone,
      fax: address.fax,
      website: address.website,
    }
    return orderedAddress;
  }
  orderVendorBasicInformation(basicInfo: any) {
    const formattedBasic = {
      name: basicInfo.name,
      countryOfRegistration: basicInfo.countryOfRegistration,
      tinNumber: basicInfo.tinNumber,
      tinIssuedDate: basicInfo?.tinIssuedDate,
      registrationNumber: basicInfo?.registrationNumber,
      registrationIssuedDate: basicInfo?.registrationIssuedDate,
      businessType: basicInfo?.businessType
    }
    return formattedBasic;
  }

}
