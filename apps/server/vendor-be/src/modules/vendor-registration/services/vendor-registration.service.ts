import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { EntityManager, In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { SetVendorStatus } from '../dto/vendor.dto';
import {
  VendorInitiationDto,
  VendorInitiationResponseDto,
} from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import {
  BusinessAreaEntity,
  Category,
  InvoiceEntity,
  IsrVendorsEntity,
  ServicePrice,
  VendorsEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
  WorkflowInstanceResponse,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { InvoiceService } from './invoice.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import axios from 'axios';
import {
  FppaDataDto,
  MbrsData,
  MbrsDataDto,
  NCICDataDto,
} from '../dto/mbrsData.dto';
import { IsrVendorsResponseDto } from '../dto/isrvendor.dto';
import { BusinessAreaDetailResponseDto } from '../dto/business-area.dto';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { BusinessAreaService } from './business-area.service';
import InitialValueSchema from '../dto/add-vendor.dto';
import { ProfileInfoEntity } from 'src/entities/profile-info.entity';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { BpServiceService } from 'src/modules/services/services/service.service';
import { ReceiptDto } from '../dto/receipt.dto';
import { FileService } from './file.service';
import { REQUEST } from '@nestjs/core';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import { BusinessCategories } from 'src/modules/handling/enums/business-category.enum';
@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(ProfileInfoEntity)
    private readonly profileInfoRepository: Repository<ProfileInfoEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly BpServiceService: BpServiceService,
    private readonly invoiceService: InvoiceService,
    private readonly pricingService: ServicePricingService,
    private readonly baService: BusinessAreaService,
    private readonly fileService: FileService,
    private readonly commonService: HandlingCommonService,
  ) {
    super(vendorRepository);
  }
  private serviceStatus = [
    VendorStatusEnum.APPROVED,
    VendorStatusEnum.PENDING,
    VendorStatusEnum.ADJUSTMENT,
  ];
  private updateVendorEnums: string[] = [
    VendorStatusEnum.DRAFT,
    VendorStatusEnum.ACTIVE,
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.COMPLETED,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.APPROVED,
  ];

  private onprogressAppStatuses: string[] = [
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.PENDING,
  ];
  async submitVendorInformation(data: any, userInfo: any): Promise<any> {
    try {
      // const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const tempVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id, status: Not(VendorStatusEnum.REJECTED) },
        relations: { businessAreas: true },
      });

      if (!tempVendor) throw new HttpException('vendor_not_found', 404);
      if (
        tempVendor.status == VendorStatusEnum.SUBMITTED ||
        tempVendor.status == VendorStatusEnum.APPROVED ||
        tempVendor.status == VendorStatusEnum.COMPLETED
      )
        throw new HttpException('vendor already Exist', 400);
      if (data.status.trim() == VendorStatusEnum.SUBMIT) {
        let response = null;
        const interests = data.areasOfBusinessInterest;
        const interestsLength = interests.length;
        if (interestsLength <= 0)
          throw new HttpException('areas_of_businessInterest_not_found', 404);
        const bp =
          await this.bpService.findBpWithServiceByKey('NewRegistration');
        if (!bp) throw new NotFoundException('Business_Process_Not_Found');
        let workflowInstance = null;

        const ba = tempVendor?.businessAreas?.filter(
          (item) => item.status !== VendorStatusEnum.REJECTED,
        );
        const businessAreasLength = ba.length;
        if (businessAreasLength > 0) {
          const instanceId = businessAreasLength[0].instanceId;
          const dto = new GotoNextStateDto();
          dto.action = 'ISR';
          dto.data = data;
          dto.instanceId = instanceId;
          workflowInstance = await this.workflowService.gotoNextStep(
            dto,
            userInfo,
          );
          response = {
            applicationNumber: workflowInstance.applicationNumber,
            instanceNumber: workflowInstance.id,
            vendorId: workflowInstance.requestorId,
            serviceId: workflowInstance.serviceId,
          };
        } else {
          const wfi = new CreateWorkflowInstanceDto();
          wfi.user = userInfo;
          wfi.bpId = bp.id;
          wfi.serviceId = bp.serviceId;
          wfi.requestorId = data.id;
          wfi.data = data;
          workflowInstance = await this.workflowService.intiateWorkflowInstance(
            wfi,
            userInfo,
          );
          workflowInstance = workflowInstance.application;
          if (!workflowInstance)
            throw new HttpException(`workflow_initiation_failed`, 400);
        }
        const businessAreaEntities = [];
        for (let i = 0; i < interestsLength; i++) {
          let businessAreaEntity = null;
          if (businessAreasLength > 0) {
            const alreadyExisingBusinessArea =
              await this.businessAreaRepository.findOne({
                where: {
                  category: interests[i].category,
                  vendorId: tempVendor.id,
                  status: VendorStatusEnum.ADJUSTMENT,
                },
              });

            businessAreaEntity = alreadyExisingBusinessArea;
          } else {
            businessAreaEntity = new BusinessAreaEntity();
          }

          businessAreaEntity.instanceId = workflowInstance.id;
          businessAreaEntity.category = interests[i].category;
          businessAreaEntity.serviceId = bp.serviceId;
          businessAreaEntity.applicationNumber =
            workflowInstance.applicationNumber;
          businessAreaEntity.status = VendorStatusEnum.PENDING;
          businessAreaEntity.vendorId = tempVendor.id;
          businessAreaEntity.priceRangeId = interests[i].priceRange;
          businessAreaEntities.push(businessAreaEntity);
        }
        await this.businessAreaRepository.save(businessAreaEntities);

        const isrVendor = await this.fromInitialValue(data);

        const initial = isrVendor.initial;
        initial.status = VendorStatusEnum.SUBMITTED;
        initial.level = VendorStatusEnum.SUBMITTED;
        isrVendor.initial = initial;
        isrVendor.status = VendorStatusEnum.SUBMITTED;
        isrVendor.id = tempVendor.id;

        await this.isrVendorsRepository.save(isrVendor);
        response = {
          applicationNumber: workflowInstance.applicationNumber,
          instanceNumber: workflowInstance.id,
          vendorId: workflowInstance.requestorId,
          serviceId: workflowInstance.serviceId,
        };
        return response;
      } else {
        throw new HttpException('invalid status', 400);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addDraftVendorInformation(data: any, userInfo: any): Promise<any> {
    try {
      const initiatedVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id, status: VendorStatusEnum.DRAFT },
      });
      if (!initiatedVendor)
        throw new HttpException('vendor is not initiated', 400);
      if (
        data.initial.status == VendorStatusEnum.DRAFT ||
        data.initial.status == VendorStatusEnum.SAVE
      ) {
        const isrVendor = await this.fromInitialValue(data);
        if (
          data.initial.level.trim() === VendorStatusEnum.PAYMENT &&
          data.initial.status.trim() === VendorStatusEnum.SAVE
        ) {
          let ncicData = null;
          let fppaData = null;
          const length = data.areasOfBusinessInterest.length;
          for (let index = 0; index < length; index++) {
            if (data.basic.origin == 'MW' || data.basic.origin == 'Malawi') {
              if (
                data.areasOfBusinessInterest[index] === 'work' &&
                ncicData == null
              ) {
                ncicData = await this.GetNCICData(isrVendor.tinNumber);
                if (ncicData == null) {
                  isrVendor.initial.status = VendorStatusEnum.SAVE;
                  isrVendor.initial.level = VendorStatusEnum.PPDA;
                } else {
                  isrVendor.basic.district = ncicData?.district;
                  isrVendor.address.mobilePhone = ncicData?.telephoneNumber;
                  isrVendor.address.postalAddress = ncicData?.postalAddress;
                  isrVendor.address.primaryEmail = ncicData?.email;
                }
              } else if (fppaData == null) {
                fppaData = await this.GetFPPAData(isrVendor.tinNumber);
                if (fppaData !== null) {
                  isrVendor.basic.businessType = fppaData.businessType;
                  isrVendor.contactPersons.mobileNumber = fppaData.mobileNumber;
                  continue;
                }
              } else if (fppaData !== null) {
                continue;
              }
            } else {
              isrVendor.initial.status = VendorStatusEnum.SAVE;
              isrVendor.initial.level = VendorStatusEnum.PPDA;
              // await this.isrVendorsRepository.save(isrVendor);
            }
          }
        }
        let priceRangeIds = [];
        if (data?.areasOfBusinessInterest.length > 0) {
          priceRangeIds = data.areasOfBusinessInterest.map(
            (item: any) => item.priceRange,
          );
        }
        const vendorInfo: any = {
          id: isrVendor?.id,
          name: isrVendor.basic['name'],
        };
        await this.invoiceService.generateInvoice(
          priceRangeIds,
          vendorInfo,
          userInfo,
        );
        await this.isrVendorsRepository.save(isrVendor);
        return { msg: 'Success' };
      } else {
        throw new BadRequestException('invalid status');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addService(
    businessArea: CreateAreasOfBusinessInterest[],
    userInfo: any,
  ): Promise<any> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (vendor && !vendor.canRequest)
        throw new NotFoundException("can't add service");
      const wfi = new CreateWorkflowInstanceDto();
      wfi.user = userInfo;
      const userId = userInfo.id;
      const data = await this.isrVendorsRepository
        .createQueryBuilder('isrVendor')
        .leftJoinAndSelect('isrVendor.businessAreas', 'businessArea')
        .where('isrVendor.userId = :userId', { userId: userId })
        .andWhere('isrVendor.status != :status', {
          status: VendorStatusEnum.REJECTED,
        })
        .getOne();
      if (
        data?.status == VendorStatusEnum.SUBMITTED ||
        data?.status == VendorStatusEnum.ADJUSTMENT
      )
        throw new HttpException('have already pending application', 400);
      if (data?.status == VendorStatusEnum.COMPLETED)
        throw new NotFoundException('Applied for all services');
      if (businessArea?.length <= 0)
        throw new HttpException('areas_of_businessInterest_not_found', 404);
      const length = businessArea?.length;
      const response = [];
      let fppaData = null;
      const canRequest = null;
      const appliedBuinessAreas = data.businessAreas.filter(
        (item) => item.status !== VendorStatusEnum.REJECTED,
      );
      for (let i = 0; i < length; i++) {
        if (
          appliedBuinessAreas.some(
            (obj) => obj.category === businessArea[i].category,
          )
        )
          throw new HttpException(`service already applied`, 400);
        const bp = await this.bpService.findBpService(
          businessArea[i].priceRange,
        );

        if (!bp) {
          throw new NotFoundException('Business_Process_Not_Found');
        }
        wfi.bpId = bp.id;
        wfi.serviceId = bp.serviceId;
        wfi.requestorId = data.id;
        wfi.data = data;
        let workflowInstance = null;
        const businessAreaApproved = await this.businessAreaRepository.findOne({
          where: {
            serviceId: bp.serviceId,
            vendorId: wfi.requestorId,
            status: In(this.serviceStatus),
            category: businessArea[i].category,
          },
        });
        if (businessAreaApproved) {
          continue;
        } else {
          workflowInstance = await this.workflowService.intiateWorkflowInstance(
            wfi,
            userInfo,
          );
          if (!workflowInstance)
            throw new HttpException(`workflow_initiation_failed`, 400);
          const businessAreaEntity = new BusinessAreaEntity();
          businessAreaEntity.instanceId = workflowInstance.application.id;
          businessAreaEntity.category = businessArea[i].category;
          businessAreaEntity.serviceId = bp.serviceId;
          businessAreaEntity.applicationNumber =
            workflowInstance.application.applicationNumber;
          businessAreaEntity.status = VendorStatusEnum.PENDING;
          businessAreaEntity.vendorId = data.id;
          businessAreaEntity.priceRangeId = businessArea[i].priceRange;
          await this.businessAreaRepository.save(businessAreaEntity);
          const areaOfBusinessInterest = data.areasOfBusinessInterest;
          areaOfBusinessInterest.push(...businessArea);
          await this.isrVendorsRepository.update(
            { id: data.id },
            { areasOfBusinessInterest: areaOfBusinessInterest },
          );

          const ba = data.businessAreas;
          let count = 0;
          ba?.map((item) => {
            if (
              (item?.category == BusinessCategories.WORKS,
              BusinessCategories.SERVICES,
              BusinessCategories.GOODS)
            ) {
              count++;
            }
          });
          if (count == 3) {
            data.status = VendorStatusEnum.COMPLETED;
            data.initial.status = VendorStatusEnum.COMPLETED;
            data.initial.level = VendorStatusEnum.COMPLETED;
            await this.isrVendorsRepository.update(
              { id: data.id },
              { status: VendorStatusEnum.COMPLETED },
            );
            await this.vendorRepository.update(
              { userId: data.userId },
              { status: VendorStatusEnum.COMPLETED },
            );
          }
          let canPay = true;
          if (
            businessArea[i].category !== BusinessCategories.WORKS &&
            fppaData == null
          ) {
            fppaData = await this.GetFPPAData(data.tinNumber);
            if (fppaData !== null) {
              canPay = false;
              continue;
            }
          } else if (fppaData !== null) {
            canPay = false;
            continue;
          }

          response.push({
            applicationNumber: workflowInstance.application.applicationNumber,
            instanceNumber: workflowInstance.application.id,
            vendorId: workflowInstance.application.requestorId,
            canPay: canPay,
          });
          const invoices = await this.invoiceService.getInvoicesUserAndService(
            workflowInstance.application.userId,
          );
          invoices.map((row) => {
            if (row.pricingId == businessAreaEntity.priceRangeId) {
              const businessAreaId = businessAreaEntity.id;
              row.businessAreaId = businessAreaId;
              this.invoiceService.update(row.id, row);
            }
          });
        }
        if (!workflowInstance)
          throw new NotFoundException(`workflowInstanceService_failed`);
      }
      if (canRequest !== null) {
        await this.vendorRepository.update(
          { userId: data.userId },
          { canRequest: false },
        );
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addVendorInformations(data: any, userInfo: any): Promise<any> {
    try {
      if (
        data.initial.status == VendorStatusEnum.DRAFT ||
        data.initial.status == VendorStatusEnum.SAVE ||
        data.initial.status == VendorStatusEnum.SUBMIT
      ) {
        if (data?.paymentReceipt == undefined || data?.paymentReceipt == null) {
          data.paymentReceipt = {
            transactionId: '',
            category: '',
            invoiceId: '',
            attachment: '',
          };
        }

        const isrVendor = await this.fromInitialValue(data);
        const result = await this.isrVendorsRepository.save(isrVendor);
        if (
          data.initial.level.trim() === VendorStatusEnum.PAYMENT &&
          data.initial.status.trim() === VendorStatusEnum.SAVE
        ) {
          let ncicData = null;
          let fppaData = null;
          const length = data.areasOfBusinessInterest.length;
          //to get al/ the registration fee for each service
          let priceRangeIds = [];
          if (data?.areasOfBusinessInterest.length > 0) {
            priceRangeIds = data.areasOfBusinessInterest.map(
              (item: any) => item.priceRange,
            );
          }

          for (let index = 0; index < length; index++) {
            if (data.basic.origin == 'MW' || data.basic.origin == 'Malawi') {
              if (
                data.areasOfBusinessInterest[index] === 'work' &&
                ncicData == null
              ) {
                ncicData = await this.GetNCICData(isrVendor.tinNumber);
                if (ncicData == null) {
                  isrVendor.initial.status = VendorStatusEnum.SAVE;
                  isrVendor.initial.level = VendorStatusEnum.PPDA;
                  await this.isrVendorsRepository.save(isrVendor);
                } else {
                  isrVendor.basic.district = ncicData?.district;
                  isrVendor.address.mobilePhone = ncicData?.telephoneNumber;
                  isrVendor.address.postalAddress = ncicData?.postalAddress;
                  isrVendor.address.primaryEmail = ncicData?.email;
                  // isrVendor.basic.businessType = ncicData?.typeOfRegistration
                  await this.isrVendorsRepository.save(isrVendor);
                }
              } else if (fppaData == null) {
                fppaData = await this.GetFPPAData(isrVendor.tinNumber);
                if (fppaData !== null) {
                  isrVendor.basic.businessType = fppaData.businessType;
                  isrVendor.contactPersons.mobileNumber = fppaData.mobileNumber;
                  await this.isrVendorsRepository.save(isrVendor);
                  continue;
                }
              } else if (fppaData !== null) {
                continue;
              }
            } else {
              isrVendor.initial.status = VendorStatusEnum.SAVE;
              isrVendor.initial.level = VendorStatusEnum.PPDA;
              await this.isrVendorsRepository.save(isrVendor);
            }
            const vendor: VendorsEntity = new VendorsEntity();
            //  result.basic['id'] = result.id;
            vendor.id = result.id;
            vendor.name = result.basic['name'];
            await this.invoiceService.generateInvoice(
              priceRangeIds,
              vendor,
              userInfo,
            );
          }
        } else if (
          data.initial.level.trim() === VendorStatusEnum.SUBMIT &&
          data.initial.status.trim() === VendorStatusEnum.SUBMIT
        ) {
          return this.submitVendorInformation(data, userInfo);
        }
        return { msg: 'Success' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getApplicationStatus(userId: string) {
    const data = await this.isrVendorsRepository.findOne({
      where: { userId: userId, status: In(this.updateVendorEnums) },
      select: { id: true },
    });
    const ba = await this.businessAreaRepository.find({
      where: { vendorId: data.id },
    });
    const status = 'status';
    if (ba.length === 0) {
      return {
        status: 'Initial',
        initial: {
          level: 'Initial',
          status: 'Initial',
        },
      };
    }

    const statusMap = {
      [VendorStatusEnum.PENDING]: 'Pending',
      [VendorStatusEnum.ADJUSTMENT]: 'Adjustment',
      [VendorStatusEnum.SUBMITTED]: 'Submitted',
      [VendorStatusEnum.DRAFT]: 'Draft',
      [VendorStatusEnum.APPROVED]: 'Approved',
    };

    for (const statusValue in statusMap) {
      if (ba.some((obj) => obj[status] === statusValue)) {
        const statusText = statusMap[statusValue];
        return {
          status: statusText,
          initial: {
            level: statusText,
            status: statusText,
          },
        };
      }
    }
    return {
      status: 'Initial',
      initial: {
        level: 'Initial',
        status: 'Initial',
      },
    };
  }
  fromInitialValue = async (data: any) => {
    let vendorsEntity = new IsrVendorsEntity();
    vendorsEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: data.userId,
      },
    });
    if (!vendorsEntity) throw new NotFoundException('vendor_not_found!!');
    const initial = vendorsEntity.initial;
    if (vendorsEntity.status === VendorStatusEnum.SUBMITTED)
      throw new HttpException('vendor_already_submitted', 400);
    if (vendorsEntity.status === VendorStatusEnum.APPROVED)
      throw new HttpException('vendor_already_approved', 400);
    vendorsEntity = { id: vendorsEntity.id, ...data };
    initial.status =
      data.initial.status == 'Submit'
        ? VendorStatusEnum.SUBMITTED
        : data.initial.status;
    vendorsEntity.initial = data.initial;
    vendorsEntity.businessAreas =
      vendorsEntity?.businessAreas?.length > 0
        ? vendorsEntity?.businessAreas
        : undefined;
    vendorsEntity.tinNumber = data.basic.tinNumber;
    return vendorsEntity;
  };
  async updateVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      let response: any = null;
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (!result) throw new NotFoundException(`isr_Vendor_not_found`);

      const vendor = await this.vendorRepository.findOne({
        where: { isrVendorId: vendorStatusDto.isrVendorId },
      });
      if (vendor) {
        const businessArea = await this.businessAreaRepository.findOne({
          where: { instanceId: vendorStatusDto.instanceId },
          relations: { BpService: true },
        });
        if (businessArea) {
          if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
            businessArea.status = VendorStatusEnum.APPROVED;
          } else if (vendorStatusDto.status == VendorStatusEnum.REJECT) {
            businessArea.status = VendorStatusEnum.REJECTED;
            const serviceType = await this.BpServiceService.findOne(
              vendorStatusDto.serviceId,
            );
            if (!serviceType)
              throw new HttpException('Bp service not found', 404);
            if (
              serviceType &&
              serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
              vendorStatusDto.status == VendorStatusEnum.REJECT
            ) {
              const profileData = await this.profileInfoRepository.findOne({
                where: {
                  vendorId: vendor.id,
                  status: VendorStatusEnum.SUBMITTED,
                },
              });
              if (!profileData)
                throw new HttpException(`profile not found`, 404);
              profileData.status = VendorStatusEnum.REJECTED;
              await this.profileInfoRepository.save(profileData);
            }
          }
          businessArea.approvedAt = new Date();
        }

        const upgradekeys = [
          ServiceKeyEnum.goodsUpgrade,
          ServiceKeyEnum.servicesUpgrade,
          ServiceKeyEnum.worksUpgrade,
        ];
        const renewalKeys = [
          ServiceKeyEnum.goodsRenewal,
          ServiceKeyEnum.servicesRenewal,
          ServiceKeyEnum.worksRenewal,
        ];

        const upgradeServices = upgradekeys.filter(
          (item) => item == businessArea.BpService?.key,
        );
        if (
          upgradeServices.length == 0 &&
          businessArea.BpService?.key != ServiceKeyEnum.PROFILE_UPDATE
        ) {
          const expireDate = new Date();
          expireDate.setFullYear(expireDate.getFullYear() + 1);
          businessArea.expireDate = expireDate;
        }
        const renwalServiceKeys = renewalKeys.filter(
          (item) => item == businessArea.BpService.key,
        );
        if (renwalServiceKeys.length > 0 || upgradeServices.length > 0) {
          const previousBA = await this.businessAreaRepository.findOne({
            where: {
              status: ApplicationStatus.APPROVED,
              category: businessArea.category,
              instanceId: Not(vendorStatusDto.instanceId),
              vendorId: vendorStatusDto.isrVendorId,
            },
          });
          if (previousBA) {
            previousBA.status = ApplicationStatus.OUTDATED;
            await this.businessAreaRepository.save(previousBA);
          }
        }
        businessArea.remark = vendorStatusDto.remark;
        const businessUpdate =
          await this.businessAreaRepository.save(businessArea);
        response = businessUpdate;
      } else {
        if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
          const isrVendorData = result;
          const basic = isrVendorData.basic;
          const initial = isrVendorData.initial;
          if (result.status !== VendorStatusEnum.APPROVED) {
            const Categories = [
              BusinessCategories.SERVICES,
              BusinessCategories.GOODS,
              BusinessCategories.WORKS,
            ];
            const appliedServices = await this.businessAreaRepository.find({
              where: {
                vendorId: vendorStatusDto.isrVendorId,
                status: VendorStatusEnum.APPROVED,
                category: In(Categories),
              },
            });

            if (appliedServices?.length >= 3) {
              initial.status = VendorStatusEnum.COMPLETED;
              initial.level = VendorStatusEnum.COMPLETED;
              result.status = VendorStatusEnum.COMPLETED;
            } else {
              // initial.status = VendorStatusEnum.DRAFT;
              // initial.level = VendorStatusEnum.PPDA;
              result.status = VendorStatusEnum.APPROVED;
            }
            // result.initial = initial;
            await this.isrVendorsRepository.save(result);
            const vendorEntity = new VendorsEntity();
            vendorEntity.id = result.id;
            vendorEntity.status = VendorStatusEnum.APPROVED;
            vendorEntity.level = VendorStatusEnum.COMPLETED;
            vendorEntity.name = basic.name;
            vendorEntity.formOfEntity = basic.businessType;
            vendorEntity.origin = basic.origin;
            vendorEntity.district = basic.district;
            vendorEntity.tin = basic.tinNumber;
            vendorEntity.userId = result.userId;
            vendorEntity.isrVendorId = result.id;
            vendorEntity.shareholders = isrVendorData.shareHolders;
            vendorEntity.vendorAccounts = isrVendorData.bankAccountDetails;
            vendorEntity.areasOfBusinessInterest =
              isrVendorData.areasOfBusinessInterest;
            vendorEntity.beneficialOwnership =
              isrVendorData.beneficialOwnership;
            vendorEntity.registrationNumber =
              await this.commonService.generateApplicationNumber('MW', 'EGP');
            let tempMetadata = null;
            tempMetadata = {
              address: isrVendorData.address,
              contactPersons: isrVendorData.contactPersons,
              businessSizeAndOwnership: isrVendorData.businessSizeAndOwnership,
              supportingDocuments: isrVendorData.supportingDocuments,
              paymentReceipt: isrVendorData.paymentReceipt,
              initial: isrVendorData.initial,
            };
            vendorEntity.metaData = tempMetadata;
            await this.vendorRepository.save(vendorEntity);
          }
          // const nextYear = new Date();
          // nextYear.setFullYear(nextYear.getFullYear() + 1);
          const businessArea = await this.businessAreaRepository.find({
            where: {
              vendorId: vendorStatusDto.isrVendorId,
              instanceId: vendorStatusDto.instanceId,
            },
            relations: { BpService: true },
          });
          if (businessArea.length == 0)
            throw new HttpException(
              `businessArea_not_found`,
              HttpStatus.NOT_FOUND,
            );
          const length = businessArea.length;
          const businessAreas = [];
          for (let index = 0; index < length; index++) {
            businessArea[index].status = VendorStatusEnum.APPROVED;
            businessArea[index].approvedAt = new Date();
            businessArea[index].remark = vendorStatusDto.remark;
            const expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            businessArea[index].expireDate = expireDate;
            businessAreas.push(businessArea[index]);
          }
          const bsinessArea =
            await this.businessAreaRepository.save(businessAreas);
          return bsinessArea;
        } else {
          return await this.rejectVendor(vendorStatusDto);
        }
      }
      const serviceType = await this.BpServiceService.findOne(
        vendorStatusDto.serviceId,
      );
      if (!serviceType) throw new HttpException('Bp service not found', 404);
      if (
        serviceType &&
        serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
        vendorStatusDto.status == VendorStatusEnum.APPROVE
      ) {
        const profileData = await this.profileInfoRepository.findOne({
          where: { vendorId: vendor.id, status: VendorStatusEnum.SUBMITTED },
        });
        if (profileData) {
          profileData.status = VendorStatusEnum.APPROVED;
          await this.profileInfoRepository.save(profileData);
          await this.mapVendor(vendor, profileData);
        }
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async mapVendor(vendor: VendorsEntity, profileData: ProfileInfoEntity) {
    try {
      vendor.name = profileData.profileData?.basic?.name;
      vendor.formOfEntity = profileData.profileData?.basic?.businessType;
      vendor.origin = profileData.profileData?.basic?.origin;

      vendor.district = profileData.profileData?.basic?.district;
      vendor.shareholders = profileData.profileData?.shareHolders;
      vendor.vendorAccounts = profileData.profileData?.bankAccountDetails;
      // vendor.areasOfBusinessInterest =
      //   profileData.profileData?.areasOfBusinessInterest;
      vendor.beneficialOwnership = profileData.profileData?.beneficialOwnership;
      let tempMetadata = null;
      tempMetadata = {
        address: profileData.profileData?.address,
        contactPersons: profileData.profileData?.contactPersons,
        businessSizeAndOwnership:
          profileData.profileData?.businessSizeAndOwnership,
        supportingDocuments: profileData.profileData?.supportingDocuments,
        paymentReceipt: profileData.profileData?.paymentReceipt,
        invoice: profileData.profileData?.invoice,
      };
      vendor.metaData = profileData.profileData?.tempMetadata;
      await this.vendorRepository.save(vendor);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getInvoiceByUserId(userId: string) {
    const pendingInvoices = await this.invoiceRepository.find({
      where: { userId: userId, paymentStatus: VendorStatusEnum.PENDING },
    });
    return pendingInvoices;
  }
  async rejectVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      const serviceType = await this.BpServiceService.findOne(
        vendorStatusDto.serviceId,
      );
      if (!serviceType) throw new NotFoundException('Bp service not found');
      if (
        serviceType &&
        serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
        vendorStatusDto.status == VendorStatusEnum.REJECT
      ) {
        const vendor = await this.vendorRepository.findOne({
          where: { isrVendorId: vendorStatusDto.isrVendorId },
        });
        const profileData = await this.profileInfoRepository.findOne({
          where: { vendorId: vendor.id, status: VendorStatusEnum.SUBMITTED },
        });
        if (!profileData) throw new NotFoundException(` profile not found`);
        const profile = await this.profileInfoRepository.update(
          { id: profileData.id },
          { status: VendorStatusEnum.REJECTED },
        );
        return profile;
      } else {
        const vendor = await this.vendorRepository.findOne({
          where: { userId: vendorStatusDto.userId },
        });
        if (!vendor) {
          await this.isrVendorsRepository.update(
            { id: vendorStatusDto.isrVendorId },
            { status: VendorStatusEnum.REJECTED },
          );
        }
        return await this.changeBusinessAreasStatus(
          vendorStatusDto.instanceId,
          VendorStatusEnum.REJECTED,
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async adjustVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      const serviceType = await this.BpServiceService.findOne(
        vendorStatusDto.serviceId,
      );
      if (!serviceType) throw new NotFoundException('Bp service not found');
      if (serviceType.key === VendorStatusEnum.PROFILE_UPDATE_KEY) {
        const vendor = await this.vendorRepository.findOne({
          where: { isrVendorId: vendorStatusDto.isrVendorId },
        });
        if (!vendor) throw new NotFoundException(' vendor not found');
        const currentBusinessArea = await this.businessAreaRepository.findOne({
          where: {
            vendorId: vendor.id,
            instanceId: vendorStatusDto.instanceId,
          },
        });
        if (!currentBusinessArea)
          throw new BadRequestException(`businessArea_not_found`);
        currentBusinessArea.status = VendorStatusEnum.ADJUSTMENT;
        currentBusinessArea.remark = vendorStatusDto.remark;
        const businessArea =
          await this.businessAreaRepository.save(currentBusinessArea);
        if (!businessArea)
          throw new BadRequestException(`business_area_update_failed`);
        const profileData = await this.profileInfoRepository.findOne({
          where: {
            vendorId: vendor.id,
            status: In([
              VendorStatusEnum.SUBMITTED,
              VendorStatusEnum.ADJUSTMENT,
            ]),
          },
        });
        if (!profileData) throw new NotFoundException(` profile not found`);
        profileData.status = VendorStatusEnum.ADJUSTMENT;
        await this.profileInfoRepository.save(profileData);
        return businessArea;
      } else {
        const vendor = await this.vendorRepository.findOne({
          where: { userId: vendorStatusDto.userId },
        });
        if (!vendor) {
          const initial: any = {
            level: VendorStatusEnum.DETAIL,
            status: VendorStatusEnum.DRAFT,
          };
          await this.isrVendorsRepository.update(
            { id: vendorStatusDto.isrVendorId },
            { status: VendorStatusEnum.ADJUSTMENT, initial: initial },
          );
        }
        return await this.changeBusinessAreasStatus(
          vendorStatusDto.instanceId,
          VendorStatusEnum.ADJUSTMENT,
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async changeBusinessAreasStatus(instanceId: string, status: string) {
    const response = [];
    const currentBusinessArea = await this.businessAreaRepository.find({
      where: {
        instanceId: instanceId,
      },
    });
    if (currentBusinessArea.length === 0)
      throw new BadRequestException(`businessArea_not_found`);
    const length = currentBusinessArea.length;
    for (let index = 0; index < length; index++) {
      currentBusinessArea[index].status = status;
      currentBusinessArea[index].remark = status;
      response.push(currentBusinessArea[index]);
    }
    await this.businessAreaRepository.save(response);
    return response;
  }
  async vendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
    if (vendorInitiationDto.country == 'MW') {
      const mbrsDataDto = new MbrsDataDto();
      mbrsDataDto.tin = vendorInitiationDto.tinNumber;
      mbrsDataDto.issuedDate = vendorInitiationDto.tinIssuedDate;
      const result = await this.GetMBRSData(mbrsDataDto);
      if (result == null) throw new NotFoundException('something went wrong');
      if (!result) throw new NotFoundException('something went wrong');
    }
    const vendor = await this.isrVendorsRepository.findOne({
      where: {
        userId: userInfo.id,
        status: In(this.updateVendorEnums),
      },
    });
    if (vendor) return { id: vendor.id, message: 'vendor exist' };
    if (vendorInitiationDto.tinNumber) {
      const vendorByTinExists = await this.isrVendorsRepository.findOne({
        where: {
          tinNumber: vendorInitiationDto.tinNumber,
          status: In(this.updateVendorEnums),
        },
      });
      if (vendorByTinExists)
        return {
          tin: vendorInitiationDto.tinNumber,
          message: 'tin_already_already_exist',
        };
    }
    const vendorsEntity = new IsrVendorsEntity();
    vendorsEntity.userId = userInfo.id;
    vendorsEntity.tinNumber = vendorInitiationDto?.tinNumber;
    vendorsEntity.status = VendorStatusEnum.DRAFT;
    const initial = {
      userId: userInfo.id,
      status: vendorInitiationDto.status,
      level: vendorInitiationDto.level,
      issueDate: vendorInitiationDto.tinIssuedDate,
    };
    vendorsEntity.initial = initial;
    vendorsEntity.basic = vendorInitiationDto;
    try {
      const result = await this.isrVendorsRepository.save(vendorsEntity);
      if (result) {
        return { vendorId: result.id };
      }
    } catch (error) {
      throw error;
    }
  }

  async getIsrVendorInvoiceByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (!vendorEntity) {
        throw new HttpException('isr_vendor_not_found', HttpStatus.BAD_REQUEST);
      }
      const areaOfBusinessInterest = vendorEntity.areasOfBusinessInterest;
      const invoices = await this.getInvoices(areaOfBusinessInterest, userId);
      let totalAmount = 0;
      invoices?.map((element) => {
        totalAmount = Number(totalAmount) + Number(element.amount);
      });

      return { ...vendorEntity, invoice: invoices, totalAmount: totalAmount };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getIsrVendorByStatusBUserId(userId: string, status: string) {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: status },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Notfound');

    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity.areasOfBusinessInterest,
      services: vendorEntity.businessAreas,
    };
  }
  async getPendingIsrVendorByUserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: In(this.onprogressAppStatuses) },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Notfound');

    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity?.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity?.areasOfBusinessInterest,
      services: vendorEntity?.businessAreas,
    };
  }
  async getPendingServices(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      select: {
        id: true,
        basic: true,
        initial: true,
        status: true,
        areasOfBusinessInterest: true,
        businessAreas: true,
      },
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
        businessAreas: { status: In(['Pending']) },
      },
    });
    if (!vendorEntity) throw new NotFoundException('vendor Notfound');
    const areasOfBusinessInterest = vendorEntity.businessAreas.filter((item) =>
      vendorEntity.areasOfBusinessInterest.some(
        (data) => item.category === data.category,
      ),
    );
    return {
      name: vendorEntity?.basic.name,
      tinNumber: vendorEntity?.basic.tinNumber,
      level: vendorEntity.initial?.level,
      vendorStatus: vendorEntity.status,
      Status: vendorEntity.initial?.status,
      areasOfBusinessInterest: vendorEntity.areasOfBusinessInterest,
      services: vendorEntity.businessAreas,
    };
  }
  async getVendorByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          areasOfBusinessInterest: true,
          isrVendor: { businessAreas: true },
        },
      });
      if (!vendorEntity) return null;

      const { isrVendor, ...vendor } = vendorEntity;
      const { businessAreas } = isrVendor;

      const vendorEntityRes = { vendor, businessAreas };
      return vendorEntityRes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getIsrVendorByVendorId(vendorId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          id: vendorId,
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendor(userId: string): Promise<VendorsEntity> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: {
          userId: userId,
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getApplicationsByUserIdAndStatus(
    userId: string,
    status: string,
  ): Promise<any> {
    try {
      const applications = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
        relations: { businessAreas: true },
      });
      const businessAreaByStatus = applications.businessAreas.filter(
        (item) => item.status == status,
      );
      return businessAreaByStatus;
    } catch (error) {
      throw error;
    }
  }
  async getIsrVendorByUserId(
    userId: string,
    flag: string = null,
  ): Promise<any> {
    try {
      const vendorEntity: any = await this.isrVendorsRepository.findOne({
        relations: { businessAreas: true },
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (vendorEntity?.areasOfBusinessInterest) {
        const formattedAreaOfBi = [];
        const pricesIds = vendorEntity?.areasOfBusinessInterest.map(
          (item: any) => item.priceRange,
        );
        const priceRanges =
          await this.pricingService.findPriceRangeByIds(pricesIds);
        for (const price of priceRanges) {
          for (const bi of vendorEntity?.areasOfBusinessInterest) {
            if (bi.priceRange == price.id) {
              const priceRange = this.commonService.formatPriceRange(price);
              const lob = bi.lineOfBusiness.map((item: any) => item.name);
              formattedAreaOfBi.push({
                category: this.commonService.capitalizeFirstLetter(bi.category),
                priceRange: priceRange,
                lineOfBusiness: lob,
              });
            }
          }
        }
        vendorEntity.areasOfBusinessInterestView = formattedAreaOfBi;
      }

      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendorByUserWithPreferntial(
    userId: string,
    serviceId: string,
  ): Promise<VendorsEntity> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          id: true,
          preferentials: {
            serviceId: true,
            status: true,
            remark: true,
            extendedProfile: true,
            certificateUrl: true,
            certiNumber: true,
          },
          isrVendor: {
            id: true,
            businessAreas: { id: true, instanceId: true },
          },
        },
        relations: {
          preferentials: true,
          isrVendor: { businessAreas: true },
        },
        where: {
          userId: userId,
          preferentials: {
            status: ApplicationStatus.SUBMITTED,
            serviceId: serviceId,
          },
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendorByUserWithProfile(
    userId: string,
    serviceId: string,
  ): Promise<VendorsEntity> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          id: true,
          ProfileInfo: { status: true, profileData: true },
          isrVendor: {
            id: true,
            businessAreas: { id: true, instanceId: true },
          },
        },
        relations: {
          ProfileInfo: true,
          isrVendor: { businessAreas: true },
        },
        where: {
          userId: userId,
          ProfileInfo: { status: ApplicationStatus.SUBMITTED },
          isrVendor: { businessAreas: { status: ApplicationStatus.PENDING } },
        },
      });
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }

  async getInvoices(areaOfBusinessInterest: any[], userId: string) {
    const invoice = [];
    for (let index = 0; index < areaOfBusinessInterest?.length; index++) {
      const element = await this.invoiceRepository.findOne({
        where: {
          userId: userId,
          paymentStatus: In(['Pending']),
          pricingId: areaOfBusinessInterest[index].priceRange,
        },
      });
      if (!element) return null;
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(new Date().getDate() - 14);
      const expired = element.createdOn < fourteenDaysAgo;
      invoice.push({ ...element, expired: expired });
    }
    return invoice;
  }
  async getIsrVendors(): Promise<any[]> {
    try {
      const vendorEntity = await this.isrVendorsRepository.find();
      return vendorEntity;
    } catch (error) {
      throw error;
    }
  }
  async getVendorByIdForCertificate(isrvendorId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        isrVendorId: isrvendorId,
        isrVendor: {
          businessAreas: {
            status: In(['Approved', 'APPROVED']),
            category: In([
              BusinessCategories.GOODS,
              BusinessCategories.SERVICES,
            ]),
          },
        },
      },
      relations: {
        isrVendor: { businessAreas: { BpService: true, servicePrice: true } },
        areasOfBusinessInterest: true,
      },
    });
    return result;
  }

  async getVendors(
    user: any,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VendorInitiationResponseDto>> {
    const dataQuery = QueryConstructor.constructQuery<VendorsEntity>(
      this.vendorRepository,
      query,
    );
    dataQuery.andWhere('vendors.status=:status', {
      status: ApplicationStatus.APPROVED,
    });
    const [items, total] = await dataQuery.getManyAndCount();
    const response = new DataResponseFormat<VendorInitiationResponseDto>();
    response.items = items.map((item) =>
      VendorInitiationResponseDto.toResponse(item),
    );
    response.total = total;
    return response;
  }
  async GetMBRSData(mbrsDataDto) {
    try {
      const url = `${process.env.MBRA_URL}/${mbrsDataDto.tin}/${mbrsDataDto.issuedDate}`;
      console.log(url);
      const result = await axios.get(url);
      if (!result) return null;
      return result;
      // commented because mbrs api is not working
      // const mbrsurl = `{process.env.MBRS_URL}/${mbrsDataDto.tinNumber}/${mbrsDataDto.licenseNumber}`;
      // const mbrsResponse = await axios.get(mbrsurl);
      // if (!mbrsResponse) throw new HttpException(`not found in mbrs`, 500);
      // const mbrsData: MbrsData = new MbrsData();
      // mbrsData.businessLicenseNumber =
      //   mbrsResponse?.data?.businessLicenseNumber;
      // mbrsData.businessName = mbrsResponse?.data?.businessName;
      // mbrsData.dateRegistered = mbrsResponse?.data?.dateRegistered;
      // mbrsData.firstName = mbrsResponse?.data?.firstName;
      // mbrsData.lastName = mbrsResponse?.data?.lastName;
      // mbrsData.legalStatus = mbrsResponse?.data?.legalStatus;
      // mbrsData.middleName = mbrsResponse?.data?.middleName;
      // mbrsData.nationality = mbrsResponse?.data?.nationality;
      // mbrsData.organizationName = mbrsResponse?.data?.organizationName;
      // mbrsData.tin = mbrsResponse?.data?.tin;
      // return mbrsData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async GetNCICData(tinNumber: string) {
    try {
      const nCICDataDto: NCICDataDto = new NCICDataDto();
      const url = `${process.env.NCIC_URL}/${tinNumber}`;
      const response = await axios.get(url);
      if (
        response?.data == null ||
        response?.data?.tin !== tinNumber.toString().trim()
      )
        return null;
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async GetFPPAData(tinNumber: string) {
    try {
      const url = `${process.env.FPPA_URL}/${tinNumber}`;
      const response = await axios.get(url);
      const fppaDataDto: FppaDataDto = new FppaDataDto();
      fppaDataDto.id = response?.data?.id;
      fppaDataDto.tin = response?.data?.tin;
      fppaDataDto.accountName = response?.data?.accountName;
      fppaDataDto.accountNo = response?.data?.accountNo;
      fppaDataDto.businessType = response?.data?.businessType;
      fppaDataDto.mobileNumber = response?.data?.mobileNumber;
      fppaDataDto.supplierCode = response?.data?.supplierCode;
      fppaDataDto.supplierName = response?.data?.supplierName;
      // return fppaDataDto;
      if (!response.data || response.data == null) return null;
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getRenewalIsrVendor(userId: string) {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: VendorStatusEnum.RENEWAL,
      },
    });
    if (!result) throw new NotFoundException('vendor not found');
    const data = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
      },
    });
    data.initial.level = VendorStatusEnum.PPDA;
    data.initial.status = VendorStatusEnum.DRAFT;
    result.id = undefined;
    result.status = VendorStatusEnum.RENEWAL;
    const res = await this.isrVendorsRepository.save(result);
    // const initial = businessAreas
    return res;
  }

  async submitServiceUpgrade(
    file: Express.Multer.File,
    user: any,
    paymentReceiptDto: ReceiptDto,
  ) {
    const userId = user.id;
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new NotFoundException('vendor not found ');

      const vendor = await this.vendorRepository.findOne({
        where: { userId: userId },
        select: { canRequest: true },
      });
      if (!vendor.canRequest)
        throw new NotFoundException(`profile update in progress`);
      const subDirectory = 'paymentReceipt';
      const uploadedFileName = await this.fileService.uploadDocuments(
        file,
        user,
        subDirectory,
      );
      const paymentReceipt = {
        transactionNumber: paymentReceiptDto?.transactionNumber,
        invoiceId: paymentReceiptDto?.invoiceIds,
        attachment: uploadedFileName,
      };
      result.paymentReceipt = paymentReceipt;
      result.initial.level = VendorStatusEnum.DOC;
      result.initial.status = VendorStatusEnum.SAVE;
      await this.isrVendorsRepository.save(result);
      const ids = JSON.parse(paymentReceiptDto?.invoiceIds);
      for (let index = 0; index < ids.length; index++) {
        await this.invoiceRepository.update(ids[index], {
          paymentStatus: PaymentStatus.PAID,
          attachment: uploadedFileName,
        });
      }
      const invoices = await this.invoiceRepository.find({
        where: {
          id: In(ids),
          businessArea: {
            BpService: {
              businessProcesses: { isActive: true },
            },
          },
        },
        relations: {
          businessArea: {
            BpService: { businessProcesses: true },
            isrVendor: true,
          },
        },
      });

      const wfi: CreateWorkflowInstanceDto = new CreateWorkflowInstanceDto();
      for (const row of invoices) {
        const businessArea = row.businessArea;
        const ba = await this.baService.findOne(businessArea.id);
        if (
          ba.status == ApplicationStatus.PENDING ||
          ba.status == ApplicationStatus.ADJUST ||
          ba.status == ApplicationStatus.ADJUSTMENT
        ) {
          wfi.bpId = row.businessArea.BpService.businessProcesses[0].id;
          wfi.serviceId = row.businessArea.serviceId;
          wfi.requestorId = row.businessArea.vendorId;
          wfi.data = row.businessArea.isrVendor;
          const result = await this.workflowService.intiateWorkflowInstance(
            wfi,
            user,
          );
          businessArea.instanceId = result.application?.id;
          businessArea.applicationNumber =
            result.application?.applicationNumber;
          await this.baService.update(businessArea.id, businessArea);
          // return result;
        } else {
          const gotoNextDto = new GotoNextStateDto();
          gotoNextDto.action = 'ISR';
          gotoNextDto.instanceId = ba.instanceId;
          await this.workflowService.gotoNextStep(gotoNextDto, user);
          // return result;
        }
      }
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getApprovedVendorById(VendorId: string) {
    const vendorData = await this.vendorRepository.findOne({
      where: [
        {
          id: VendorId,
          isrVendor: {
            businessAreas: {
              status: ApplicationStatus.APPROVED,
              category: In([
                BusinessCategories.GOODS,
                BusinessCategories.SERVICES,
                BusinessCategories.WORKS,
              ]),
            },
          },
        },
        { id: VendorId, preferentials: { status: ApplicationStatus.APPROVED } },
      ],
      select: {
        id: true,
        name: true,
        tin: true,
        formOfEntity: true,
        origin: true,
        metaData: true,
        status: true,
        userId: true,
        vendorAccounts: {
          accountHolderFullName: true,
          accountNumber: true,
          bankName: true,
          branchName: true,
          currency: true,
          IBAN: true,
          status: true,
          isDefualt: true,
          branchAddress: true,
        },
        shareholders: {
          firstName: true,
          lastName: true,
          nationality: true,
          share: true,
        },
        beneficialOwnership: {
          firstName: true,
          lastName: true,
          nationality: true,
        },
        areasOfBusinessInterest: {
          id: true,
          category: true,
          lineOfBusiness: true,
        },
        isrVendor: { id: true, businessAreas: true },
      },
      relations: {
        areasOfBusinessInterest: true,
        shareholders: true,
        beneficialOwnership: true,
        vendorAccounts: true,
        isrVendor: { businessAreas: { servicePrice: true, BpService: true } },
        preferentials: true,
      },
    });
    const { isrVendor, ...rest } = vendorData;
    const bussinessAreas = [];
    for (const ba of vendorData.isrVendor?.businessAreas) {
      //   const business = BusinessAreaDetailResponseDto.toResponse(ba);
      let businessarea = {};
      let bl = [];
      const priceRange = this.commonService.formatPriceRange(ba.servicePrice);
      for (const lob of vendorData.areasOfBusinessInterest) {
        if (lob.category == ba.category) {
          bl = lob.lineOfBusiness.map((item: any) => item.name);
          businessarea = {
            category: this.commonService.capitalizeFirstLetter(ba.category),
            ValueRange: priceRange,
            lineOfBusiness: bl,
            approvedAt: ba.approvedAt,
            expireDate: ba.expireDate,
            certificateUrl: ba.certificateUrl,
          };
          break;
        }
      }
      bussinessAreas.push(businessarea);
    }
    rest.areasOfBusinessInterest = bussinessAreas;
    const vendor = {
      ...rest,
    };
    return vendor;
  }
  async getRejectedVendors(user: any, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<IsrVendorsEntity>(
      this.isrVendorsRepository,
      query,
    )
      .andWhere('isr_vendors.status =:status', {
        status: ApplicationStatus.REJECTED,
      })
      .orderBy('isr_vendors.updatedAt', 'ASC');

    const d = new DataResponseFormat<IsrVendorsResponseDto>();
    const [result, total] = await dataQuery.getManyAndCount();
    d.items = result.map((entity) => {
      return IsrVendorsResponseDto.toResponse(entity);
    });
    d.total = total;
    return d;
  }

  async getRejectedISRVendorById(VendorId: string): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: { id: VendorId, status: ApplicationStatus.REJECTED },
      relations: {
        businessAreas: { servicePrice: true, BpService: true },
        instances: true,
      },
    });
    const vendor = {
      ...result,
      businessAreas: result.businessAreas.map((ba) =>
        BusinessAreaDetailResponseDto.toResponse(ba),
      ),
      areasOfBusinessInterest: result.areasOfBusinessInterest.map((entity) => {
        return {
          name: entity.lineOfBusiness[0].name,
          category: entity.category,
        };
      }),
    };
    return vendor;
  }

  async getApprovedVendorServiceByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          isrVendor: { id: true, tinNumber: true, businessAreas: true },
        },
        where: {
          userId: userId,
          status: VendorStatusEnum.APPROVED,
          isrVendor: { businessAreas: { status: VendorStatusEnum.APPROVED } },
        },
        relations: {
          areasOfBusinessInterest: true,
          isrVendor: { businessAreas: { servicePrice: true } },
        },
      });
      if (!vendorEntity)
        return {
          status: {
            level: 'Info',
            status: 'Draft',
          },
          data: [],
        };
      const areaOfBusinessInterest = await this.businessAreaRepository.find({
        where: {
          vendorId: vendorEntity.id,
          status: VendorStatusEnum.APPROVED,
        },
      });
      return {
        status: areaOfBusinessInterest[0].businessAreaState,
        data: areaOfBusinessInterest.map((value, index) => ({
          id: value.id,
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.find(
            (element) => element.category === value.category,
          ),
        })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getMyApprovedService(user: any): Promise<any> {
    try {
      // user.id = '4408fe5d-2672-4c2f-880d-4928b960e096';
      const vendorEntity = await this.vendorRepository.findOne({
        select: {
          isrVendor: { id: true, tinNumber: true, businessAreas: true },
        },
        where: {
          userId: user.id,
          status: VendorStatusEnum.APPROVED,
          isrVendor: {
            businessAreas: {
              status: VendorStatusEnum.APPROVED,
              category: In([
                BusinessCategories.GOODS,
                BusinessCategories.SERVICES,
                BusinessCategories.WORKS,
              ]),
            },
          },
        },
        relations: {
          isrVendor: { businessAreas: { servicePrice: true } },
          areasOfBusinessInterest: true,
        },
      });

      let bas = vendorEntity?.isrVendor?.businessAreas;
      if (!bas) bas = [];
      const baInstanceIds = [];
      const baResponse = [];
      for (const row of bas) {
        baInstanceIds.push(row.instanceId);
        baResponse.push({
          id: row.id,
          vendorId: row.vendorId,
          pricingId: row.priceRangeId,
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.find(
            (element) => element.category === row.category,
          ),
        });
      }

      const onProgressRequests =
        await this.baService.getBusinessAreaByInstanceIds(baInstanceIds);
      const selectedServices = [];
      onProgressRequests.map((row) => {
        const oldBaId = bas.find((item) => item.instanceId == row.instanceId);
        selectedServices.push({
          businessAreaId: row.id,
          pricingId: row.priceRangeId,
          invoiceId: row.invoice.id,
          _businessAreaId: oldBaId.id,
          invoice: row.invoice,
        });
      });

      return {
        status: {
          level: 'info',
          status: selectedServices.length == 0 ? 'Draft' : 'Payment',
          selectedPriceRange: selectedServices,
        },
        data: baResponse,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async initiateVendorProfileUpdate(userId: string) {
    const isrVendor = await this.isrVendorsRepository.findOne({
      where: { userId: userId, status: VendorStatusEnum.APPROVED },
    });
    isrVendor.id = undefined;
    isrVendor.status = VendorStatusEnum.UPDATE;
    isrVendor.initial.status = VendorStatusEnum.DRAFT;
    isrVendor.initial.level = VendorStatusEnum.BASIC;
    isrVendor.areasOfBusinessInterest =
      InitialValueSchema.areasOfBusinessInterest;
    isrVendor.bankAccountDetails = InitialValueSchema.bankAccountDetails;
    isrVendor.beneficialOwnership = InitialValueSchema.beneficialOwnership;
    isrVendor.businessSizeAndOwnership =
      InitialValueSchema.businessSizeAndOwnership;
    isrVendor.contactPersons = InitialValueSchema.contactPersons;
    isrVendor.initial = InitialValueSchema.initial;
    isrVendor.address = InitialValueSchema.address;
    isrVendor.basic = InitialValueSchema.basic;
    isrVendor.shareHolders = InitialValueSchema.shareHolders;
    const result = await this.isrVendorsRepository.save(isrVendor);
    return result;
  }
  async updateVendorProfile(isrVendorId: string, data: any) {
    const isrVendor = await this.isrVendorsRepository.findOne({
      where: { id: isrVendorId },
    });
    if (
      data?.initial?.status == VendorStatusEnum.DRAFT ||
      data.initial.level !== VendorStatusEnum.SUBMIT
    ) {
      isrVendor.areasOfBusinessInterest = data?.areasOfBusinessInterest;
      isrVendor.bankAccountDetails = data?.bankAccountDetails;
      isrVendor.beneficialOwnership = data?.beneficialOwnership;
      isrVendor.businessSizeAndOwnership = data?.businessSizeAndOwnership;
      isrVendor.contactPersons = data?.contactPersons;
      isrVendor.initial = data?.initial;
      isrVendor.address = data?.address;
      isrVendor.basic = data?.basic;
      isrVendor.shareHolders = data?.shareHolders;
      return isrVendor;
    } else if (
      data?.initial?.status == VendorStatusEnum.SUBMIT &&
      data.initial.level !== VendorStatusEnum.SUBMIT
    ) {
    }
  }

  async cancelRegistration(user: any) {
    const vendor = await this.isrVendorsRepository.findOne({
      where: { userId: user.id, status: Not(ApplicationStatus.APPROVED) },
    });
    try {
      if (vendor) {
        await this.invoiceRepository.delete({
          userId: user.id,
          paymentStatus: PaymentStatus.PENDING,
        });
        await this.businessAreaRepository.delete({
          vendorId: vendor.id,
          status: VendorStatusEnum.PENDING,
        });
        await this.isrVendorsRepository.delete({
          userId: user.id,
          status: Not(VendorStatusEnum.APPROVED),
        });
        return true;
      } else {
        await this.invoiceRepository.delete({
          userId: user.id,
          paymentStatus: PaymentStatus.PENDING,
        });
        await this.businessAreaRepository.delete({
          vendorId: vendor.id,
          status: PaymentStatus.PENDING,
        });
        return true;
      }
    } catch (error) {
      throw new HttpException(
        'Unable to cancel registration request ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllBusinessAreasByUserId(userId: string) {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      relations: { businessAreas: { BpService: true } },
      where: {
        userId: userId,
      },
    });
    return vendorEntity;
  }
  formatBusinessLines(bia: any[], prices: ServicePrice[]): any[] {
    const businessInterests = [];
    if (bia?.length > 0) {
      for (const bi of bia) {
        const lobs = bi?.lineOfBusiness?.map((item) => {
          return item?.name;
        });
        let range = {};
        for (const item of prices) {
          if (bi.priceRange == item.id) {
            range = {
              priceFrom: item?.valueFrom,
              priceTo: item?.valueTo == -1 ? 'infinity' : item?.valueTo,
            };
            break;
          }
        }
        businessInterests.push({
          category: bi.category,
          lineOfBusiness: lobs,
          ...range,
        });
      }
      return businessInterests;
    }
  }
  async getVendorInformation(userId: string) {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userId },
        relations: {
          shareholders: true,
          areasOfBusinessInterest: true,
          beneficialOwnership: true,
          businessCats: true,
          vendorAccounts: true,
        },
      });
      if (!vendor) throw new NotFoundException('vendor not found');
      const result = await this.profileInfoRepository.findOne({
        where: {
          vendorId: vendor.id,
          status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
        },
      });
      if (result == null) {
        const vendorEntity = new IsrVendorsEntity();

        vendorEntity.areasOfBusinessInterest = vendor.areasOfBusinessInterest;

        const priceRangeIds = vendor?.areasOfBusinessInterest.map(
          (item: any) => item.priceRange,
        );
        let priceRanges = [];
        if (priceRangeIds.length > 0) {
          priceRanges =
            await this.pricingService.findPriceRangeByIds(priceRangeIds);
          const businessInterest = WorkflowInstanceResponse.formatBusinessLines(
            vendor.areasOfBusinessInterest,
            priceRanges,
          );
          vendorEntity.areasOfBusinessInterest = businessInterest;
        }
        vendorEntity.bankAccountDetails = vendor.vendorAccounts;
        vendorEntity.basic = {
          name: vendor.name,
          origin: vendor.origin,
          district: vendor.district,
          tinNumber: vendor.tin,
          businessType: vendor.formOfEntity,
        };
        vendorEntity.beneficialOwnership = vendor.beneficialOwnership;
        vendorEntity.id = vendor.id;
        vendorEntity.userId = vendor.userId;
        vendorEntity.tinNumber = vendor.tin;
        vendorEntity.status = vendor.status;
        vendorEntity.tenantId = vendor.tenantId;
        vendorEntity.shareHolders = vendor.shareholders;
        vendorEntity.address = vendor.metaData?.address;
        vendorEntity.initial = vendor.metaData?.initial;
        vendorEntity.contactPersons = vendor.metaData?.contactPersons;
        vendorEntity.invoice = vendor.metaData?.invoice;
        vendorEntity.businessSizeAndOwnership =
          vendor.metaData?.businessSizeAndOwnership;
        vendorEntity.supportingDocuments = vendor.metaData?.supportingDocuments;
        vendorEntity.paymentReceipt = vendor.metaData?.paymentReceipt;
        return vendorEntity;
      } else {
        const priceRangeIds = result.profileData?.areasOfBusinessInterest.map(
          (item: any) => item.priceRange,
        );
        let priceRanges = [];
        if (priceRangeIds.length > 0) {
          priceRanges =
            await this.pricingService.findPriceRangeByIds(priceRangeIds);
          const businessInterest = WorkflowInstanceResponse.formatBusinessLines(
            result.profileData?.areasOfBusinessInterest,
            priceRanges,
          );
          result.profileData.areasOfBusinessInterest = businessInterest;
        }
        return result.profileData;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addVendorProfileUpdate(profileData: any, userInfo: any) {
    try {
      const result = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });

      if (!result) throw new NotFoundException('vendor not found ');

      const updateInfoNew = await this.profileInfoRepository.findOne({
        where: { vendorId: result.id, status: VendorStatusEnum.SUBMITTED },
      });
      if (updateInfoNew !== null) {
        return { status: 'profile update is already submitted' };
      }
      const updateInfo = await this.profileInfoRepository.findOne({
        where: { vendorId: result.id, status: 'Active' },
      });
      let resultData = null;
      if (updateInfo == null) {
        const profileInfoEntity = new ProfileInfoEntity();
        profileInfoEntity.vendorId = result?.id;
        profileInfoEntity.status = 'Active';
        profileInfoEntity.profileData = profileData;
        resultData = this.profileInfoRepository.save(profileInfoEntity);
      } else {
        updateInfo.profileData = profileData;
        resultData = await this.profileInfoRepository.save(updateInfo);
      }
      return resultData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitVendorProfileUpdate(profileData: any, userInfo: any) {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!vendor) throw new NotFoundException('vendor not found');
      if (!vendor.canRequest)
        throw new NotFoundException('profile update already submitted');
      const updateInfo = await this.profileInfoRepository.findOne({
        where: {
          vendorId: vendor.id,
          status: In([
            VendorStatusEnum.ACTIVE,
            VendorStatusEnum.SUBMITTED,
            VendorStatusEnum.DRAFT,
            VendorStatusEnum.ADJUSTMENT,
          ]),
        },
      });

      if (updateInfo?.status == 'Submitted')
        throw new BadRequestException('Already Submitted Profile Update');
      if (
        updateInfo == null ||
        updateInfo.status == VendorStatusEnum.APPROVED
      ) {
        const profileInfoEntity = new ProfileInfoEntity();
        profileInfoEntity.vendorId = vendor?.id;
        profileInfoEntity.status = ApplicationStatus.SUBMITTED;
        profileInfoEntity.profileData = profileData;
        await this.profileInfoRepository.save(profileInfoEntity);
      } else if (
        updateInfo.status == VendorStatusEnum.ACTIVE ||
        updateInfo.status == VendorStatusEnum.DRAFT
      ) {
        updateInfo.profileData = profileData;
        updateInfo.status = 'Submitted';
        await this.profileInfoRepository.save(updateInfo);
      } else if (updateInfo.status == VendorStatusEnum.ADJUSTMENT) {
        updateInfo.status = 'Submitted';
        updateInfo.profileData = profileData;
        const resultData = await this.profileInfoRepository.save(updateInfo);
        const response = this.goToworkflow(userInfo, resultData);
        return response;
      }
      const wfi = new CreateWorkflowInstanceDto();
      wfi.user = userInfo;
      const bp = await this.bpService.findBpWithServiceByKey(
        VendorStatusEnum.PROFILE_UPDATE_KEY,
      );
      if (!bp) throw new NotFoundException('bp service with this key notfound');
      wfi.bpId = bp.id;
      wfi.serviceId = bp.serviceId;
      wfi.requestorId = vendor.id;
      wfi.data = { ...profileData };
      const workflowInstance =
        await this.workflowService.intiateWorkflowInstance(wfi, userInfo);
      if (!workflowInstance)
        throw new HttpException('workflow initiation failed', 400);
      const businessAreaEntity = new BusinessAreaEntity();
      businessAreaEntity.instanceId = workflowInstance.application.id;
      businessAreaEntity.category = ServiceKeyEnum.PROFILE_UPDATE;
      businessAreaEntity.serviceId = bp.serviceId;
      businessAreaEntity.applicationNumber =
        workflowInstance.application.applicationNumber;
      businessAreaEntity.status = VendorStatusEnum.PENDING;
      businessAreaEntity.vendorId = vendor.id;
      businessAreaEntity.status = 'Pending';
      await this.businessAreaRepository.save(businessAreaEntity);
      await this.vendorRepository.update(
        { id: vendor.id },
        { canRequest: false },
      );
      return {
        applicationNumber: workflowInstance.application.applicationNumber,
        instanceNumber: workflowInstance.application.id,
        vendorId: workflowInstance.application.requestorId,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async goToworkflow(userInfo: string, profileData: ProfileInfoEntity) {
    let workflowInstance = null;
    const response = [];
    const vendorId = profileData.vendorId;
    const businessArea = await this.businessAreaRepository.findOne({
      where: { vendorId: vendorId, status: VendorStatusEnum.ADJUSTMENT },
    });
    const dto = new GotoNextStateDto();
    dto.action = 'ISR';
    dto.data = profileData;
    dto.instanceId = businessArea.instanceId;
    workflowInstance = await this.workflowService.gotoNextStep(dto, userInfo);
    if (!workflowInstance)
      throw new HttpException(`workflow_initiation_failed`, 400);
    response.push({
      applicationNumber: workflowInstance.applicationNumber,
      instanceNumber: workflowInstance.id,
      vendorId: workflowInstance.requestorId,
      serviceId: workflowInstance.serviceId,
    });
    businessArea.status = VendorStatusEnum.PENDING;
    const ba = await this.businessAreaRepository.save(businessArea);
    if (!ba) throw new HttpException('business area update failed', 400);
    return response;
  }
  async getCertificateInformations(userId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        userId: userId,
        status: VendorStatusEnum.APPROVED,
        isrVendor: { businessAreas: { status: VendorStatusEnum.APPROVED } },
      },
      relations: { isrVendor: { businessAreas: true } },
    });
    if (result == null) return { status: 'no approved service' };
    return result.isrVendor.businessAreas;
  }
  async getPreferenctialCerteficates(userId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        userId: userId,
        status: VendorStatusEnum.APPROVED,
        preferentials: { status: ApplicationStatus.APPROVED },
      },
      relations: { preferentials: true },
    });
    if (result == null)
      return { status: 'No approved Preferential treatment certeficates' };
    return result.preferentials;
  }

  async cancelApplication(wfi: UpdateWorkflowInstanceDto) {
    const vendor = this.vendorRepository.findOne({
      where: { id: wfi.requestorId },
    });
    if (vendor) {
      return await this.baService.cancelServiceApplication(wfi.id);
    } else {
      await this.baService.cancelServiceApplication(wfi.id);
      const tempVendor = await this.isrVendorsRepository.findOne({
        where: { id: wfi.requestorId },
      });
      tempVendor.status = ApplicationStatus.REJECTED;
      await this.isrVendorsRepository.update(wfi.requestorId, tempVendor);
      return true;
    }
  }
}
