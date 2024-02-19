import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { UpdateTaskHandlerDto } from 'src/modules/bpm/dto/task-handler.dto';
import { WorkflowInstanceResponse } from '../dto/workflow-instance.dto';
import { InvoiceService } from 'src/modules/vendor-registration/services/invoice.service';
import { HandlingCommonService } from './handling-common-services';
import { AssignmentEnum } from '../enums/assignment.enum';
import { HandlerTypeEnum } from '../enums/handler-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { In, IsNull, Not, Repository } from 'typeorm';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { BusinessAreaEntity } from 'src/entities';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { BpServiceService } from 'src/modules/services/services/service.service';
@Injectable()
export class ApplicationExcutionService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wiRepository: Repository<WorkflowInstanceEntity>,
    private readonly commonService: HandlingCommonService,
    private readonly pricingService: ServicePricingService,
    private readonly vendorService: VendorRegistrationsService,
    private readonly baService: BusinessAreaService,
  ) { }

  async getCurruntTaskByServiceKey(
    serviceKey: string,
    query: CollectionQuery,
    user: any,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const keys = this.commonService.getServiceCatagoryKeys(serviceKey);
    console.log(keys);
    if (keys.length < 0) throw new HttpException('Invalid Request', 400);
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.wiRepository,
      query,
    );
    dataQuery
      .innerJoinAndSelect('workflow_instances.taskHandler', 'handler')
      .innerJoinAndSelect('handler.task', 'task')
      .leftJoinAndSelect('workflow_instances.service', 'service')
      // .leftJoinAndSelect('workflow_instances.isrVendor', 'isrVendor')
      // .leftJoinAndSelect('workflow_instances.isrVendor.businessAreas', 'businessAreas')
      .innerJoinAndSelect('workflow_instances.businessProcess', 'bp')
      .leftJoinAndSelect('workflow_instances.taskTrackers', 'taskTracker')
      .andWhere('service.key In(:...keys)', { keys: keys })
      .andWhere('workflow_instances.status !=:status ', {
        status: ApplicationStatus.COMPLETED,
      })
      .andWhere('task.handlerType !=:handlerType', {
        handlerType: HandlerTypeEnum.REQUESTOR,
      })
      .orderBy('workflow_instances.submittedAt', 'ASC');
    const d = new DataResponseFormat<WorkflowInstanceResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return WorkflowInstanceResponse.toResponse(entity);
    });
    d.total = total;
    return d;
  }
  async getCurruntTaskDetail(
    instanceId: string,
  ): Promise<WorkflowInstanceResponse> {
    const appData = await this.wiRepository.findOne({
      relations: { service: true },
      where: { id: instanceId },
    });
    const instance = await this.wiRepository.findOne({
      relations: {
        isrVendor: { businessAreas: { servicePrice: true } },
        businessProcess: {
          service: true,
        },
        taskHandler: {
          task: true,
        },
        taskTrackers: {
          task: true,
        },
        service: true,
      },
      where: {
        id: instanceId,
        taskHandler: { id: Not(IsNull()) },
        isrVendor: {
          businessAreas: {
            instanceId: appData.id,
            status: In([ApplicationStatus.PENDING, ApplicationStatus.ADJUSTMENT]),
          },
        },
      },
      order: {
        taskTrackers: { executedAt: 'DESC' },
      },
    });
    if (!instance) {
      throw new NotFoundException('Not Found');
    }
    const response = WorkflowInstanceResponse.toResponse(instance);
    delete response.businessProcess;
    const priceRangeIds = instance.isrVendor?.areasOfBusinessInterest.map(
      (item: any) => item.priceRange,
    );
    let priceRanges = [];
    if (priceRangeIds.length > 0) {
      priceRanges =
        await this.pricingService.findPriceRangeByIds(priceRangeIds);
      const businessInterest = WorkflowInstanceResponse.formatBusinessLines(
        response.isrvendor.areasOfBusinessInterest,
        priceRanges,
      );
      response.isrvendor.areasOfBusinessInterest = businessInterest;
    }
    const preferentialkeys = this.commonService.getPreferencialServices();
    if (appData.service.key == ServiceKeyEnum.PROFILE_UPDATE) {
      const vendorInfo = await this.vendorService.getVendorByUserWithProfile(
        response.isrvendor.userId,
        appData.serviceId,
      );
      if (vendorInfo?.ProfileInfo) {
        const profileUpdate = vendorInfo?.ProfileInfo[0];
        const shareholders = profileUpdate.profileData.shareHolders.map(
          (item) => this.reduceAttributes(item),
        );
        profileUpdate.profileData.shareholders = shareholders;
        const beneficialOwnership =
          profileUpdate.profileData.beneficialOwnership.map((item) =>
            this.reduceAttributes(item),
          );
        profileUpdate.profileData.beneficialOwnership = beneficialOwnership;
        const bankAccountDetails =
          profileUpdate.profileData.bankAccountDetails.map((item) =>
            this.reduceAttributes(item),
          );
        profileUpdate.profileData.bankAccountDetails = bankAccountDetails;
        response.profileUpdate = profileUpdate;
      }
      response.isrvendor.businessAreas = null;
      return response;
    } else if (
      preferentialkeys.filter((item) => appData.service.key == item).length > 0
    ) {
      const vendorInfo =
        await this.vendorService.getVendorByUserWithPreferntial(
          response.isrvendor.userId,
          appData.serviceId,
        );
      if (vendorInfo?.preferentials) {
        response.preferential = vendorInfo?.preferentials[0];
        response.isrvendor.businessAreas = null;
        return response;
      }
    }
    const serviceKey = appData.service.key;
    const renewalServices = this.commonService.getServiceCatagoryKeys(ServiceKeyEnum.renewal)
    // [
    //   ServiceKeyEnum.goodsRenewal,
    //   ServiceKeyEnum.servicesRenewal,
    //   ServiceKeyEnum.worksRenewal,
    // ];
    const upgradeServices = this.commonService.getServiceCatagoryKeys(ServiceKeyEnum.upgrade)
    //  [
    //   ServiceKeyEnum.goodsUpgrade,
    //   ServiceKeyEnum.servicesUpgrade,
    //   ServiceKeyEnum.worksUpgrade,
    // ];
    const renewalServiceTypes = renewalServices.filter(
      (item) => item == serviceKey,
    );
    const upgradeServicesTypes = upgradeServices.filter(
      (item) => item == serviceKey,
    );
    if (renewalServiceTypes.length > 0) {
      const business: BusinessAreaEntity = instance.isrVendor.businessAreas[0];
      response.renewal = {
        category: business.category,
        approvedAt: business.approvedAt,
        expireDate: business.expireDate,
      };
      response.isrvendor.businessAreas = null;
      return response;
    } else if (upgradeServicesTypes.length > 0) {
      const business: BusinessAreaEntity = instance.isrVendor.businessAreas[0];
      const previousBusinessClass =
        await this.baService.getPreviousUpgradeService(
          instance.requestorId,
          business.category,
        );
      const proposedBusinessclass =
        await this.baService.getProposedUpgradeService(
          instance.requestorId,
          business.category,
          instance.serviceId,
        );
      response.upgrade = {
        category: previousBusinessClass.category,
        approvedAt: previousBusinessClass.approvedAt,
        expireDate: previousBusinessClass.expireDate,
        valueFrom: previousBusinessClass.servicePrice.valueFrom,
        valueTo:
          previousBusinessClass.servicePrice.valueTo != -1
            ? previousBusinessClass.servicePrice.valueTo
            : 'infinity',
        newCategory: proposedBusinessclass.category,
        newValueFrom: proposedBusinessclass.servicePrice.valueFrom,
        newValueTo:
          proposedBusinessclass.servicePrice.valueTo != -1
            ? proposedBusinessclass.servicePrice.valueTo
            : 'infinity',

        // proposedBusinessClass: {

        // }
      };
    }
    response.isrvendor.businessAreas = null;

    return response;
  }
  reduceAttributes(object: any) {
    const {
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

  async pickTask(
    dto: UpdateTaskHandlerDto,
    user: any,
  ): Promise<WorkflowInstanceResponse> {
    const wfInstance = await this.wiRepository.findOne({
      relations: {
        taskHandler: true,
      },
      where: { id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Picked;
    wfInstance.taskHandler.handlerUserId = user.id;
    wfInstance.taskHandler.handlerUser = user;
    wfInstance.taskHandler.pickedAt = new Date();
    const result = await this.wiRepository.save(wfInstance);
    if (result) return WorkflowInstanceResponse.toResponse(result);
    return null;
  }
  async unpickTask(dto: UpdateTaskHandlerDto) {
    const wfInstance = await this.wiRepository.findOne({
      relations: { taskHandler: true },
      where: { id: dto.instanceId },
    });
    if (!wfInstance.taskHandler) {
      throw new BadRequestException();
    }
    wfInstance.taskHandler.assignmentStatus = AssignmentEnum.Unpicked;
    wfInstance.taskHandler.handlerUserId = null; //
    wfInstance.taskHandler.handlerUser = null;
    wfInstance.taskHandler.pickedAt = null;
    return await this.wiRepository.save(wfInstance);
  }
}
