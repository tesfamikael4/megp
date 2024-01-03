import { InjectRepository } from '@nestjs/typeorm';
import { BusinessAreaEntity } from 'src/entities';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { BAEnum } from 'src/modules/vendor-registration/dto/business-area.enum';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ServiceKeyEnum } from '../dto/workflow-instance.enum';

export class HandlingCommonService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wfiRepository: Repository<WorkflowInstanceEntity>,
  ) { }
  generateRandomString(length, prefix = '') {
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
}
