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
import { In, IsNull, Not, Repository } from 'typeorm';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { BusinessAreaEntity } from 'src/entities';
import { BusinessAreaService } from 'src/modules/vendor-registration/services/business-area.service';
import { PreferentailTreatmentService } from 'src/modules/vendor-registration/services/preferentail-treatment.service';
@Injectable()
export class ApplicationExcutionService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly wiRepository: Repository<WorkflowInstanceEntity>,
    private readonly commonService: HandlingCommonService,
    private readonly vendorService: VendorRegistrationsService,
    private readonly baService: BusinessAreaService,
    private readonly invoiceService: InvoiceService,
    private readonly ptService: PreferentailTreatmentService,
  ) { }
  async getCurruntTaskByServiceKey(
    serviceKey: string,
    query: CollectionQuery,
    user: any,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const keys = this.commonService.getServiceCatagoryKeys(serviceKey);
    if (keys.length < 0) throw new HttpException('Invalid Request', 400);
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.wiRepository,
      query,
    );
    dataQuery
      .innerJoinAndSelect('workflow_instances.taskHandler', 'handler')
      .innerJoinAndSelect('handler.task', 'task')
      .leftJoinAndSelect('workflow_instances.service', 'service')
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
            status: In([
              ApplicationStatus.PENDING,
              ApplicationStatus.ADJUSTMENT,
            ]),
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
    const serviceKey = appData.service.key;
    let response = WorkflowInstanceResponse.toResponse(instance);
    delete response.businessProcess;
    const bas = instance.isrVendor?.businessAreas;
    const businessInterest = [];
    if (bas.length > 0) {
      for (const range of bas) {
        const price = range?.servicePrice;
        if (price) {
          const formattedBC = this.commonService.formatPriceRange(price);
          const bia = instance.isrVendor?.areasOfBusinessInterest.find(
            (item: any) => item.category == range.category,
          );
          const lobs = bia?.lineOfBusiness.map((item: any) => {
            return item.name;
          });

          businessInterest.push({
            category: bia?.category,
            priceRange: formattedBC,
            lineOfBusiness: lobs,
          });

          response.isrvendor.basic.status =
            range.status == ApplicationStatus.PENDING
              ? ApplicationStatus.INPROGRESS
              : range.status;
        }
      }
      response.isrvendor.areasOfBusinessInterest = businessInterest;
    }

    const preferentials = await this.ptService.getPreferetialTreatmentsByUserId(
      appData.serviceId,
      appData.userId,
    );

    const pts = [];
    if (preferentials.length) {
      for (const preferential of preferentials) {
        delete preferential.userId;
        const serviceName = preferential.service.name;
        delete preferential.service;
        const pt = {
          serviceName: serviceName,
          ...this.commonService.reduceAttributes(preferential),
        };
        pts.push(pt);
      }
      response.preferential = pts; //preferential
    }

    if (ServiceKeyEnum.REGISTRATION_RENEWAL == serviceKey) {
      const businesses: BusinessAreaEntity[] = instance.isrVendor.businessAreas;
      const result = await this.appendRenewalData(businesses, instance, response);
      response = { ...result };
      return response;
    } else if (ServiceKeyEnum.REGISTRATION_UPGRADE == serviceKey) {
      const businesses: BusinessAreaEntity[] = instance.isrVendor.businessAreas;
      const result = await this.appendUpgradeData(businesses, instance, response);
      response = { ...result };
    } else if (appData.service.key == ServiceKeyEnum.PROFILE_UPDATE) {
      const vendorInfo = await this.vendorService.getVendorByUserWithProfile(
        response.isrvendor.userId,
        appData.serviceId,
      );
      const result = await this.appendProfileData(
        vendorInfo,
        response,
        businessInterest,
      );
      response.isrvendor.businessAreas = null;
      return result;
    }

    response.isrvendor.businessAreas = null;

    return response;
  }
  /*
  Append renewal information in to response object
  */
  async appendRenewalData(
    businesses: BusinessAreaEntity[],
    instance: any,
    response: any,
  ) {
    const renewalData = [];
    let serviceId = '';
    for (const business of businesses) {
      serviceId = business.serviceId;
      const formattedBusinessclass = this.commonService.formatPriceRange(
        business.servicePrice,
      );
      const previousData = {
        category: business.category,
        priceRange: formattedBusinessclass,
        approvedAt: business.approvedAt,
        expireDate: business.expireDate,
      }
      renewalData.push(previousData)
    }
    response.renewal = [...renewalData];
    response.isrvendor.businessAreas = null;
    const invoice = await this.invoiceService.getServiceReceipt(
      instance.userId,
      serviceId,
    );
    response.invoice = { ...invoice };
    response.isrvendor.paymentReceipt = {
      attachment: invoice.attachment,
      transactionNumber: invoice?.remark,
    };
    return response;
  }
  /*
 Append upgrade information in to response object
 */
  async appendUpgradeData(
    businesses: BusinessAreaEntity[],
    instance: WorkflowInstanceEntity,
    response: any,
  ) {
    const formattedPreviousClass = [];
    const formattedproposedClass = [];
    for (const business of businesses) {
      const previousBusinessClass =
        await this.baService.getPreviousUpgradeService(
          instance.requestorId,
          business.category,
        );
      const formatData = {
        category: previousBusinessClass.category,
        approvedAt: previousBusinessClass.approvedAt,
        expireDate: previousBusinessClass.expireDate,
        PreviousePriceRange: this.commonService.formatPriceRange(previousBusinessClass.servicePrice),
      }
      formattedPreviousClass.push(formatData);


      const proposedBusinessclass =
        await this.baService.getProposedUpgradeService(
          instance.requestorId,
          business.category,
          instance.serviceId,
        );
      const formatedData = {
        ProposedPriceRange: this.commonService.formatPriceRange(proposedBusinessclass.servicePrice),
        category: proposedBusinessclass.category
      }
      formattedproposedClass.push(formatedData)

    }
    // formattedproposedClass.map((prevItem)=>{
    //   const found = formattedPreviousClass.find((item: BusinessAreaEntity) => prevItem.category==item.category);
    //   formattedData.push({...found, })
    // })

    const requestedUpggrades = []
    for (const bc of formattedproposedClass) {
      const found = formattedPreviousClass.find((item) => item.category == bc.category)
      if (found) {
        requestedUpggrades.push({ ...found, ProposedPriceRange: bc.ProposedPriceRange })
      }
    }
    response.upgrade = [...requestedUpggrades]
    const invoice = await this.invoiceService.getServiceReceipt(
      instance.userId,
      instance.serviceId,
    );
    response.invoice = { ...invoice };
    response.isrvendor.paymentReceipt = {
      attachment: invoice.attachment,
      transactionNumber: invoice?.remark,
    };
    return response;
  }
  /*
 Append profile information in to response object
 */
  async appendProfileData(
    vendorInfo: any,
    response: any,
    businessInterest: any,
  ) {
    if (vendorInfo?.ProfileInfo) {
      const profileUpdate = vendorInfo?.ProfileInfo[0];
      for (const price of profileUpdate.profileData.areasOfBusinessInterest) {
        const tempvalue = {
          valueFrom: price.priceFrom,
          valueTo: price.priceTo,
        };
        const formattedBC = this.commonService.formatPriceRange(tempvalue);
        const bls = price.lineOfBusiness; //.map((item) => item.name);
        businessInterest.push({
          category: this.commonService.capitalizeFirstLetter(price.category),
          priceRange: formattedBC,
          lineOfBusiness: bls,
        });
      }
      profileUpdate.profileData.areasOfBusinessInterest = [...businessInterest];
      const bainfo = profileUpdate.profileData.bankAccountDetails.map(
        (item: any) => {
          if (item.isDefualt) {
            item.isDefualt = 'Yes';
          } else {
            item.isDefualt = 'No';
          }
          return item;
        },
      );
      profileUpdate.profileData.bankAccountDetails = [...bainfo];
      const shareholders = profileUpdate.profileData.shareHolders.map((item) =>
        this.reduceAttributes(item),
      );
      profileUpdate.profileData.shareholders = shareholders;
      const beneficialOwnership =
        profileUpdate.profileData.beneficialOwnership.map((item: any) =>
          this.reduceAttributes(item),
        );
      profileUpdate.profileData.beneficialOwnership = beneficialOwnership;
      const bankAccountDetails =
        profileUpdate.profileData.bankAccountDetails.map((item: any) =>
          this.reduceAttributes(item),
        );
      profileUpdate.profileData.basic.status = profileUpdate.status;
      profileUpdate.profileData.bankAccountDetails = bankAccountDetails;
      response.profileUpdate = profileUpdate;
      return response;
    }
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
