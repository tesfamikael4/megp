import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { BusinessAreaResponseDto } from '../dto/business-area.dto';
import { BusinessAreaEntity } from 'src/entities';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { BusinessCategories } from 'src/modules/handling/enums/business-category.enum';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';

@Injectable()
export class BusinessAreaService extends EntityCrudService<BusinessAreaEntity> {
  constructor(
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    private readonly commonService: HandlingCommonService,
  ) {
    super(businessAreaRepository);
  }
  async getByVendorId(vendorId: string): Promise<BusinessAreaResponseDto> {
    try {
      return BusinessAreaResponseDto.fromDto(
        await this.businessAreaRepository.findOneOrFail({
          where: { vendorId: vendorId },
        }),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getCerteficate(vendorId: string): Promise<BusinessAreaEntity> {
    const bas = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorId,
        status: ApplicationStatus.APPROVED,
        certificateUrl: Not(IsNull()),
      },
      order: { updatedAt: 'DESC' },
    });
    if (bas.length) return bas[0];
    return null;
  }

  async getBusinessUpgradesOrRenewal(categories: string[], serviceKey: string) {
    return this.businessAreaRepository.find({
      where: {
        category: In(categories),
        BpService: { key: serviceKey },
        status: In([ApplicationStatus.PENDING, ApplicationStatus.ADJUSTMENT]),
      },
      relations: { BpService: true, servicePrice: true },
    });
  }

  async getBusinessAreaByInstanceId(
    instanceId: string,
  ): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      where: { instanceId: instanceId },
    });
  }
  async cancelServiceApplication(instanceId: string, remark: string) {
    const bas = await this.getBusinessAreaByInstanceId(instanceId);
    for (const ba of bas) {
      ba.status = ApplicationStatus.CANCELED;
      ba.approvedAt = new Date();
      ba.remark = remark;
      await this.update(ba.id, ba);
    }

    return true;
  }
  //aproved services
  async getPreviousApprovedServices(
    vendorId: string,
    category: string[],
  ): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      relations: { BpService: true, servicePrice: true },
      where: {
        category: In(category),
        status: ApplicationStatus.APPROVED,
        vendorId: vendorId,
      },
    });
  }
  async getPreviousUpgradeService(
    vendorId: string,
    category: string,
  ): Promise<BusinessAreaEntity> {
    return this.businessAreaRepository.findOne({
      relations: { BpService: true, servicePrice: true },
      where: {
        category: category,
        status: ApplicationStatus.APPROVED,
        vendorId: vendorId,
      },
    });
  }
  async getProposedUpgradeService(
    vendorId: string,
    category: string,
    serviceId: string,
  ): Promise<BusinessAreaEntity> {
    return this.businessAreaRepository.findOne({
      relations: { BpService: true, servicePrice: true },
      where: {
        category: category,
        status: ApplicationStatus.PENDING,
        vendorId: vendorId,
        serviceId: serviceId,
      },
    });
  }

  async getUserInprogressBusinessAreaByServiceId(
    serviceId: string,
    userId: string,
  ): Promise<BusinessAreaEntity> {
    return this.businessAreaRepository.findOne({
      select: { id: true, status: true },
      where: {
        serviceId: serviceId,
        status: In([ApplicationStatus.PENDING, ApplicationStatus.ADJUSTMENT]),
        isrVendor: { userId: userId },
      },
      relations: {
        isrVendor: true,
      },
    });
  }
  async getUserInprogressBusinessAreasByServiceId(
    serviceId: string,
    userId: string,
  ): Promise<BusinessAreaEntity[]> {
    return this.businessAreaRepository.find({
      select: { id: true },
      where: {
        serviceId: serviceId,
        status: ApplicationStatus.PENDING,
        isrVendor: { userId: userId },
      },
      relations: {
        isrVendor: true,
      },
    });
  }

  async getVendorRegisteredServices(vendorId: string) {
    const result = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorId,
        status: VendorStatusEnum.APPROVED,
        category: In([
          BusinessCategories.SERVICES,
          BusinessCategories.GOODS,
          BusinessCategories.WORKS,
        ]),
      },
    });
    return result;
  }
  async getVendorServicesWithPrice(vendorId: string) {
    const result = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorId,
        status: VendorStatusEnum.APPROVED,
        category: In([
          BusinessCategories.SERVICES,
          BusinessCategories.GOODS,
          BusinessCategories.WORKS,
        ]),
      },
      relations: { servicePrice: true },
    });
    return result;
  }
  async getVendorPreferentials(vendorId: string) {
    const result = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorId,
        status: VendorStatusEnum.APPROVED,
        category: ServiceKeyEnum.PREFERENTIAL_TREATMENT,
      },
      relations: { BpService: true },
    });
    return result;
  }

  async getVendorBusinessAreaByInstanceId(
    vendorId: string,
    instanceId: string,
  ): Promise<BusinessAreaEntity[]> {
    const businessArea = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorId,
        instanceId: instanceId,
      },
      relations: { BpService: true },
    });
    return businessArea;
  }

  async saveAll(businessArea: BusinessAreaEntity[]) {
    this.businessAreaRepository.save(businessArea);
  }
  async getPreviousService(vendorId: string, category: string) {
    return await this.businessAreaRepository.findOne({
      where: {
        status: ApplicationStatus.APPROVED,
        category: category,
        vendorId: vendorId,
      },
    });
  }
}
