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
import { IsNull, Not, Repository } from 'typeorm';
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
    private readonly invoiceService: InvoiceService,
    private readonly commonService: HandlingCommonService,
    private readonly pricingService: ServicePricingService,
    private readonly vendorService: VendorRegistrationsService,
    private readonly baService: BusinessAreaService,


  ) { }

  async getCurruntTaskByServiceKey(serviceKey: string,
    query: CollectionQuery, user: any
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const keys = this.commonService.getServiceCatagoryKeys(serviceKey);
    console.log(keys)
    if (keys.length < 0)
      throw new HttpException('Invalid Request', 400);
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.wiRepository,
      query,
    );
    dataQuery
      .innerJoinAndSelect('workflow_instances.taskHandler', 'handler')
      .innerJoinAndSelect('handler.task', 'task')
      .leftJoinAndSelect('workflow_instances.service', 'service')
      .leftJoinAndSelect('workflow_instances.isrVendor', 'vendor')
      .innerJoinAndSelect('workflow_instances.businessProcess', 'bp')
      .leftJoinAndSelect('workflow_instances.taskTrackers', 'taskTracker')
      .andWhere('service.key In(:...keys)', { keys: keys })
      .andWhere('workflow_instances.status !=:status ', { status: ApplicationStatus.COMPLETED })
      .andWhere('task.handlerType !=:handlerType', { handlerType: HandlerTypeEnum.REQUESTOR })
      .orderBy('workflow_instances.submittedAt', 'ASC');
    const d = new DataResponseFormat<WorkflowInstanceResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return WorkflowInstanceResponse.toResponse(entity)
    });
    d.total = total;
    return d;
  }


  async getCurruntTaskDetail(
    instanceId: string
  ): Promise<WorkflowInstanceResponse> {
    const serviceData = await this.wiRepository.findOne({
      relations: { service: true },
      where: { id: instanceId }
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
        service: true
      },
      where: {
        id: instanceId,
        taskHandler: { id: Not(IsNull()) },
        isrVendor: { businessAreas: { instanceId: serviceData.id } }
      },
      order: {
        taskTrackers: { executedAt: 'DESC' },
      },
    });
    if (!instance) {
      throw new NotFoundException('Not Found');
    }
    const response = WorkflowInstanceResponse.toResponse(instance);
    const priceRangeIds = instance.isrVendor?.areasOfBusinessInterest.map((item: any) => item.priceRange);
    let priceRanges = [];
    if (priceRangeIds.length > 0) {
      priceRanges = await this.pricingService.findPriceRangeByIds(priceRangeIds);
      const businessInterest = WorkflowInstanceResponse.formatBusinessLines(response.isrvendor.areasOfBusinessInterest, priceRanges);
      response.isrvendor.areasOfBusinessInterest = businessInterest;
    }
    const preferentialkeys = this.commonService.getPreferencialServices();
    if (serviceData.service.key == ServiceKeyEnum.profileUpdate) {
      const vendorInfo = await this.vendorService.getVendorByUserWithProfile(response.isrvendor.userId, serviceData.serviceId);
      if (vendorInfo?.ProfileInfo) {
        response.profileUpdate = vendorInfo?.ProfileInfo[0];
      }
      response.isrvendor.businessAreas = null;
      return response;
    } else if (preferentialkeys.filter((item) => serviceData.service.key == item).length > 0) {
      const vendorInfo = await this.vendorService.getVendorByUserWithPreferntial(response.isrvendor.userId, serviceData.serviceId);
      if (vendorInfo?.preferentials) {
        response.preferential = vendorInfo?.preferentials[0];
        response.isrvendor.businessAreas = null;
        return response;
      }
    }
    const serviceKey = serviceData.service.key;
    const renewalServices = [ServiceKeyEnum.goodsRenewal, ServiceKeyEnum.servicesRenewal, ServiceKeyEnum.worksRenewal];
    const upgradeServices = [ServiceKeyEnum.goodsUpgrade, ServiceKeyEnum.servicesUpgrade, ServiceKeyEnum.worksUpgrade];
    const renewalServiceTypes = renewalServices.filter((item) => item == serviceKey);
    const upgradeServicesTypes = upgradeServices.filter((item) => item == serviceKey);
    if (renewalServiceTypes.length > 0) {
      const business: BusinessAreaEntity = instance.isrVendor.businessAreas[0];
      response.renewal = { category: business.category, approvedAt: business.approvedAt, expireDate: business.expireDate };
      response.isrvendor.businessAreas = null;
      return response;
    } else if (upgradeServicesTypes.length > 0) {
      const business: BusinessAreaEntity = instance.isrVendor.businessAreas[0];
      const previousBusinessClass = await this.baService.getPreviousUpgradeService(instance.requestorId, business.category);
      const proposedBusinessclass = await this.baService.getProposedUpgradeService(instance.requestorId, business.category, instance.serviceId);
      response.upgrade = {
        previousBusinessClass: {
          category: previousBusinessClass.category,
          approvedAt: previousBusinessClass.approvedAt,
          expireDate: previousBusinessClass.expireDate,
          valueFrom: previousBusinessClass.servicePrice.valueFrom,
          valueTo: previousBusinessClass.servicePrice.valueTo != -1 ? previousBusinessClass.servicePrice.valueTo : 'infinity',
        },
        proposedBusinessClass: {
          category: proposedBusinessclass.category,
          valueFrom: proposedBusinessclass.servicePrice.valueFrom,
          valueTo: proposedBusinessclass.servicePrice.valueTo != -1 ? proposedBusinessclass.servicePrice.valueTo : 'infinity',
        }
      }
    }
    response.isrvendor.businessAreas = null;

    return response;
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
