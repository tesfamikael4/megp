import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
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
} from 'src/entities';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
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
  private updateVendorEnums: string[] = [
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

  async submitVendorInformations(data: any, userInfo: any): Promise<any> {
    try {
      // const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const tempVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!tempVendor) throw new HttpException('vendor_not_found', 404);
      if (tempVendor.status.trim() !== VendorStatusEnum.SUBMITTED) {
        const isrVendor = await this.fromInitialValue(data);

        const result = await this.isrVendorsRepository.save(isrVendor);
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        const interests = data.areasOfBusinessInterest;
        if (interests?.length <= 0)
          throw new HttpException('areas_of_businessInterest_not_found', 404);
        for (let i = 0; i < interests.length; i++) {
          const bp = await this.bpService.findBpService(
            interests[i].priceRange,
          );
          if (!bp) {
            throw new NotFoundException('Business_Process_Not_Found');
          }
          wfi.bpId = bp.id;
          wfi.serviceId = bp.serviceId;
          wfi.requestorId = result.id;
          wfi.data = result;
          const businessAreaApproved =
            await this.businessAreaRepository.findOne({
              where: {
                serviceId: bp.serviceId,
                vendorId: wfi.requestorId,
                status: VendorStatusEnum.APPROVED,
              },
            });
          if (businessAreaApproved) {
            continue;
          }
          // const tempVendor = await this.isrVendorsRepository.findOne({
          //   where: { userId: userInfo.id },
          // });
          if (!tempVendor) throw new HttpException('vendor_not_found', 404);
          if (tempVendor.status.trim() !== VendorStatusEnum.SUBMITTED) {
            const isrVendor = await this.fromInitialValue(data);
            const result = await this.isrVendorsRepository.save(isrVendor);
            const wfi = new CreateWorkflowInstanceDto();
            wfi.user = userInfo;
            const response = [];
            const interests = data.areasOfBusinessInterest;
            if (interests?.length <= 0)
              throw new HttpException(
                'areas_of_businessInterest_not_found',
                404,
              );
            for (let i = 0; i < interests.length; i++) {
              const bp = await this.bpService.findBpService(
                interests[i].priceRange,
              );
              if (!bp) {
                throw new NotFoundException('Business_Process_Not_Found');
              }
              wfi.bpId = bp.id;
              wfi.serviceId = bp.serviceId;
              wfi.requestorId = result.id;
              wfi.data = result;
              let workflowInstance = null;
              const businessAreaApproved =
                await this.businessAreaRepository.findOne({
                  where: {
                    serviceId: bp.serviceId,
                    vendorId: wfi.requestorId,
                    status: VendorStatusEnum.APPROVED,
                  },
                });
              if (businessAreaApproved) {
                continue;
              }

              const businessArea = await this.businessAreaRepository.findOne({
                where: {
                  serviceId: bp.serviceId,
                  vendorId: wfi.requestorId,
                  status: In([
                    VendorStatusEnum.PENDING,
                    VendorStatusEnum.ADJUSTMENT,
                  ]),
                },
              });
              if (businessArea) {
                const dto = new GotoNextStateDto();
                dto.action = 'ISR';
                dto.data = result;
                dto.instanceId = businessArea.instanceId;
                workflowInstance = await this.workflowService.gotoNextStep(
                  dto,
                  userInfo,
                );
                if (!workflowInstance)
                  throw new HttpException(`workflow_initiation_failed`, 400);
                response.push({
                  applicationNumber: workflowInstance.applicationNumber,
                  instanceNumber: workflowInstance.id,
                  vendorId: workflowInstance.requestorId,
                  serviceId: workflowInstance.serviceId,
                });
                businessArea.status = VendorStatusEnum.PENDING;
                await this.businessAreaRepository.save(businessArea);
              } else {
                const res = await this.businessAreaRepository.find({
                  where: {
                    serviceId: bp.serviceId,
                    vendorId: wfi.requestorId,
                    status: In([VendorStatusEnum.REJECTED]),
                  },
                });

                if (res.length == 0) {
                  workflowInstance =
                    await this.workflowService.intiateWorkflowInstance(
                      wfi,
                      userInfo,
                    );
                  if (!workflowInstance)
                    throw new HttpException(`workflow_initiation_failed`, 500);
                  response.push({
                    applicationNumber:
                      workflowInstance.application.applicationNumber,
                    instanceNumber: workflowInstance.application.id,
                    vendorId: workflowInstance.application.requestorId,
                  });

                  const businessAreaEntity = new BusinessAreaEntity();
                  businessAreaEntity.instanceId =
                    workflowInstance.application.id;
                  businessAreaEntity.category = interests[i].category;
                  businessAreaEntity.serviceId = bp.serviceId;
                  businessAreaEntity.applicationNumber =
                    workflowInstance.application.applicationNumber;
                  businessAreaEntity.status = VendorStatusEnum.PENDING;
                  businessAreaEntity.vendorId = result.id;
                  businessAreaEntity.priceRangeId = interests[i].priceRange;
                  const invoices =
                    await this.invoiceService.getInvoicesUserAndService(
                      workflowInstance.application.userId,
                    );
                  invoices.map((row) => {
                    if (row.pricingId == businessAreaEntity.priceRangeId) {
                      const businessAreaId = businessAreaEntity.id;
                      row.businessAreaId = businessAreaId;
                      this.invoiceService.update(row.id, row);
                    }
                  });
                  const res =
                    await this.businessAreaRepository.save(businessAreaEntity);
                  if (!res)
                    throw new HttpException(`adding_business_area_failed`, 500);
                } else {
                  continue;
                }
              }
              if (!workflowInstance)
                throw new HttpException(`workflowInstanceService_failed`, 500);
            }
            if (response.length == 0)
              throw new HttpException('areasOfBusinessInterest_not_found', 404);
            result.status = VendorStatusEnum.SUBMITTED;
            const initial = result.initial;
            initial.status = VendorStatusEnum.SUBMITTED;
            initial.level = VendorStatusEnum.SUBMITTED;
            result.initial = initial;
            data.basic.status = VendorStatusEnum.SUBMITTED;
            const res = await this.isrVendorsRepository.save(result);

            if (!res)
              throw new HttpException(`isr_vendor_submission_failed`, 400);
            return response;
          } else {
            throw new HttpException('already Submitted ', 500);
          }
        }
      }
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
          for (let index = 0; index < length; index++) {
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
            const vendor: VendorsEntity = new VendorsEntity();
            //  result.basic['id'] = result.id;
            vendor.id = result.id;
            vendor.name = result.basic['name'];
            if (data.areasOfBusinessInterest[index] !== 'works') {
              continue;
            }
            await this.invoiceService.generateInvoice(
              data.areasOfBusinessInterest[index].priceRange,
              vendor,
              userInfo,
            );
          }
        } else if (
          data.initial.level.trim() === VendorStatusEnum.SUBMIT &&
          data.initial.status.trim() === VendorStatusEnum.SUBMIT
        ) {
          return this.submitVendorInformations(data, userInfo);
        }
        return { msg: 'Success' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  fromInitialValue = async (data: any) => {
    let vendorsEntity = new IsrVendorsEntity();
    vendorsEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: data.initial.userId,
        ///status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });
    if (!vendorsEntity) throw new NotFoundException('vendor_not_found!!');
    const initial = JSON.parse(JSON.stringify(vendorsEntity.initial));
    if (vendorsEntity.status === VendorStatusEnum.SUBMITTED)
      throw new HttpException('vendor_already_submitted', 400);
    if (vendorsEntity.status === VendorStatusEnum.APPROVED)
      throw new HttpException('vendor_already_approved', 400);
    //Submitted
    initial.status =
      data.initial.status == 'Submit'
        ? VendorStatusEnum.SUBMITTED
        : data.initial.status;

    vendorsEntity.initial = data.initial;
    vendorsEntity.tinNumber = data.basic.tinNumber;
    vendorsEntity.basic = data.basic;
    vendorsEntity.address = data.address;
    vendorsEntity.contactPersons = data.contactPersons;
    vendorsEntity.businessSizeAndOwnership = data.businessSizeAndOwnership;
    vendorsEntity.shareHolders = data.shareHolders;
    vendorsEntity.beneficialOwnership = data.beneficialOwnership;
    vendorsEntity.bankAccountDetails = data.bankAccountDetails;
    vendorsEntity.areasOfBusinessInterest = data.areasOfBusinessInterest;
    vendorsEntity.supportingDocuments = data.supportingDocuments;
    vendorsEntity.paymentReceipt = data?.paymentReceipt;
    return vendorsEntity;
  };
  async updateVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    let response: any = null;
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In(this.updateVendorEnums),
      },
    });
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
            if (!profileData) throw new HttpException(`profile not found`, 404);
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
      if (!businessUpdate)
        throw new HttpException('business update failed', 500);
      response = businessUpdate;
    } else {
      if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
      if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
        const isrVendorData = result;
        const basic = isrVendorData.basic;
        const initial = isrVendorData.initial;
        const areasOfBusinessInterest = isrVendorData.areasOfBusinessInterest;
        if (result.status !== VendorStatusEnum.COMPLETED) {
          if (areasOfBusinessInterest.length == 3) {
            initial.status = VendorStatusEnum.COMPLETED;
            initial.level = VendorStatusEnum.COMPLETED;
            result.status = VendorStatusEnum.APPROVED;
          } else {
            initial.status = VendorStatusEnum.DRAFT;
            initial.level = VendorStatusEnum.PPDA;
            result.status = VendorStatusEnum.APPROVED;
          }
          result.initial = initial;
          const isrVendorUpdate = await this.isrVendorsRepository.save(result);
          if (!isrVendorUpdate)
            throw new HttpException(`isr_vendor_update_failed`, 500);

          const vendorEntity = new VendorsEntity();

          vendorEntity.id = result.id;
          vendorEntity.status = VendorStatusEnum.APPROVED;
          vendorEntity.level = VendorStatusEnum.COMPLETED;
          vendorEntity.name = basic.name;
          vendorEntity.formOfEntity = basic.businessType;
          vendorEntity.origin = basic.origin;
          vendorEntity.district = basic.district;
          vendorEntity.country = basic.country;
          vendorEntity.tin = basic.tinNumber;
          vendorEntity.userId = initial.userId;
          vendorEntity.isrVendorId = result.id;
          vendorEntity.shareholders = isrVendorData.shareHolders;
          vendorEntity.vendorAccounts = isrVendorData.bankAccountDetails;
          vendorEntity.areasOfBusinessInterest =
            isrVendorData.areasOfBusinessInterest;
          vendorEntity.beneficialOwnership = isrVendorData.beneficialOwnership;
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

          try {
            await this.vendorRepository.save(vendorEntity);
          } catch (error) {
            throw error;
          }
        }

        // const nextYear = new Date();
        // nextYear.setFullYear(nextYear.getFullYear() + 1);
        const businessArea = await this.businessAreaRepository.findOne({
          where: {
            vendorId: vendorStatusDto.isrVendorId,
            instanceId: vendorStatusDto.instanceId,
          },
          relations: { BpService: true },
        });

        if (!businessArea)
          throw new HttpException(
            `businessArea_not_found`,
            HttpStatus.NOT_FOUND,
          );
        businessArea.status = VendorStatusEnum.APPROVED;
        businessArea.approvedAt = new Date();
        businessArea.remark = vendorStatusDto.remark;
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        businessArea.expireDate = expireDate;
        const besinessArea =
          await this.businessAreaRepository.save(businessArea);
        return besinessArea;
      } else if (vendorStatusDto.status == VendorStatusEnum.REJECT) {
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
  }

  async mapVendor(vendor: VendorsEntity, profileData: ProfileInfoEntity) {
    vendor.name = profileData.profileData?.basic?.name;
    vendor.formOfEntity = profileData.profileData?.basic?.businessType;
    vendor.origin = profileData.profileData?.basic?.origin;
    vendor.district = profileData.profileData?.basic?.district;
    vendor.country = profileData.profileData?.basic?.country;
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
    const resl = await this.vendorRepository.save(vendor);
    if (!resl) throw new HttpException('updating vendor failed', 500);
    return true;
  }
  async propagateVendorProfileUpdate(
    vendorStatusDto: SetVendorStatus,
    vendorId: string,
    isrVendorId: string,
  ) {
    const serviceType = await this.BpServiceService.findOne(
      vendorStatusDto.serviceId,
    );
    if (
      serviceType &&
      serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
      vendorStatusDto.status == VendorStatusEnum.APPROVE
    ) {
      try {
        const profileData = await this.profileInfoRepository.findOne({
          where: { vendorId: vendorId, status: VendorStatusEnum.SUBMITTED },
        });
        profileData.status = VendorStatusEnum.APPROVED;
        profileData.profileData.initial.status = VendorStatusEnum.APPROVED;
        profileData.profileData.initial.level = VendorStatusEnum.APPROVED;
        await this.profileInfoRepository.save(profileData);

        const isrVendorData = await this.isrVendorsRepository.findOne({
          where: { id: isrVendorId },
        });
        isrVendorData.address = profileData.profileData?.address;
        isrVendorData.areasOfBusinessInterest =
          profileData.profileData?.areasOfBusinessInterest;
        isrVendorData.bankAccountDetails =
          profileData.profileData?.bankAccountDetails;
        isrVendorData.basic = profileData.profileData?.basic;
        isrVendorData.beneficialOwnership =
          profileData.profileData?.beneficialOwnership;
        // isrVendorData.businessAreas = profileData.profileData?.beneficialOwnership
        isrVendorData.businessSizeAndOwnership =
          profileData.profileData?.businessSizeAndOwnership;
        isrVendorData.contactPersons = profileData.profileData?.contactPersons;
        isrVendorData.invoice = profileData.profileData?.invoice;
        isrVendorData.paymentReceipt = profileData.profileData?.paymentReceipt;
        isrVendorData.instances = profileData.profileData?.instances;
        isrVendorData.shareHolders = profileData.profileData?.shareHolders;
        isrVendorData.supportingDocuments =
          profileData.profileData?.supportingDocuments;
        await this.isrVendorsRepository.save(isrVendorData);
        return profileData;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
  async rejectVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In(this.updateVendorEnums),
      },
    });
    if (!result) throw new Error(`isr_Vendor_not_found`);
    const res = await this.businessAreaRepository.findOne({
      where: {
        vendorId: result.id,
        instanceId: Not(vendorStatusDto.instanceId),
        status: In([
          VendorStatusEnum.APPROVED,
          VendorStatusEnum.PENDING,
          VendorStatusEnum.ADJUSTMENT,
        ]),
      },
    });
    if (!res) {
      await this.businessAreaRepository.findOne({
        where: { vendorId: result.id },
      });
      const initial = result.initial;
      initial.status = VendorStatusEnum.REJECTED;
      result.status = VendorStatusEnum.REJECTED;
      const resul = await this.isrVendorsRepository.save(result);
      if (!resul) throw new BadRequestException(`isrVendor_Update_failed`);
    }
    // if vendor have  previously approved service
    const currentBusinessArea = await this.businessAreaRepository.findOne({
      where: {
        vendorId: result.id,
        instanceId: vendorStatusDto.instanceId,
      },
    });
    if (!currentBusinessArea)
      throw new NotFoundException(`businessArea_not_found`);
    currentBusinessArea.status = VendorStatusEnum.REJECTED;
    currentBusinessArea.remark = vendorStatusDto.remark;
    const businessArea =
      await this.businessAreaRepository.save(currentBusinessArea);
    if (!businessArea)
      throw new HttpException(`business_area_rejection_failed`, 500);

    const serviceType = await this.BpServiceService.findOne(
      vendorStatusDto.serviceId,
    );
    if (!serviceType) throw new HttpException('Bp service not found', 500);
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
      if (!profileData) throw new HttpException(` profile not found`, 500);
      profileData.status = VendorStatusEnum.REJECTED;
      const profilechange = await this.profileInfoRepository.save(profileData);
      if (!profilechange)
        throw new HttpException('profile change rejection failed', 500);
    }
    return businessArea;
  }
  async adjustVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const serviceType = await this.BpServiceService.findOne(
      vendorStatusDto.serviceId,
    );
    if (!serviceType) throw new HttpException('Bp service not found', 500);
    if (serviceType.key !== VendorStatusEnum.PROFILE_UPDATE_KEY) {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In(this.updateVendorEnums),
        },
      });
      if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
      const initial = result?.initial; //JSON.parse(JSON.stringify(result?.initial));
      //if there is no previously approved service by the isr vendorId
      if (result.status !== VendorStatusEnum.COMPLETED) {
        initial.level = VendorStatusEnum.DETAIL;
        initial.status = VendorStatusEnum.DRAFT;
        result.status = VendorStatusEnum.ADJUSTMENT;
        result.initial = initial;
      } else {
        initial.level = VendorStatusEnum.PPDA;
        initial.status = VendorStatusEnum.DRAFT;
        result.status = VendorStatusEnum.ADJUSTMENT;
        result.initial = initial;
      }
      const resul = await this.isrVendorsRepository.save(result);
      if (!resul) throw new BadRequestException(`unable_to_save_isrVendor`);
      //if there is  previously approved service by the vendorId
      const currentBusinessArea = await this.businessAreaRepository.findOne({
        where: { vendorId: result.id, instanceId: vendorStatusDto.instanceId },
      });
      if (!currentBusinessArea)
        throw new BadRequestException(`businessArea_not_found`);
      currentBusinessArea.status = VendorStatusEnum.ADJUSTMENT;
      currentBusinessArea.remark = vendorStatusDto.remark;
      const businessArea =
        await this.businessAreaRepository.save(currentBusinessArea);
      if (!businessArea)
        throw new BadRequestException(`business_area_update_failed`);
      return businessArea;
    } else if (
      serviceType &&
      serviceType.key == VendorStatusEnum.PROFILE_UPDATE_KEY &&
      vendorStatusDto.status == VendorStatusEnum.ADJUST
    ) {
      const vendor = await this.vendorRepository.findOne({
        where: { isrVendorId: vendorStatusDto.isrVendorId },
      });
      if (!vendor) throw new HttpException(' vendor not found', 404);
      const currentBusinessArea = await this.businessAreaRepository.findOne({
        where: { vendorId: vendor.id, instanceId: vendorStatusDto.instanceId },
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
          status: In([VendorStatusEnum.SUBMITTED, VendorStatusEnum.ADJUSTMENT]),
        },
      });
      if (!profileData) throw new HttpException(` profile not found`, 500);
      profileData.status = VendorStatusEnum.ADJUSTMENT;
      const profilechange = await this.profileInfoRepository.save(profileData);
      if (!profilechange)
        throw new HttpException(` profile  change failed`, 500);
      return businessArea;
    }

    // return { msg: 'Success' };
  }
  async vendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
    const mbrsDataDto = new MbrsDataDto();
    mbrsDataDto.tin = vendorInitiationDto.tinNumber;
    mbrsDataDto.issuedDate = vendorInitiationDto.tinIssuedDate;
    const result = await this.GetMBRSData(mbrsDataDto);
    if (result == null) throw new HttpException('something went wrong', 500);
    if (!result) throw new HttpException('something went wrong', 400);
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
    vendorsEntity.status = VendorStatusEnum.ACTIVE;
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
    if (!vendorEntity) return { level: 'basic', status: 'new' };

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

      // if (flag == ApplicationStatus.ADJUSTMENT) {
      //   const abis = [];
      //   if (
      //     vendorEntity?.businessAreas &&
      //     vendorEntity?.areasOfBusinessInterest
      //   ) {
      //     for (const abi of vendorEntity?.areasOfBusinessInterest) {
      //       for (const ba of vendorEntity?.businessAreas) {
      //         if (
      //           ba.category == abi.category &&
      //           ba.status == ApplicationStatus.ADJUSTMENT
      //         ) {
      //           abis.push({ ...abi, status: ba.status });
      //           vendorEntity.initial.level = 'detail';
      //           vendorEntity.initial.status = 'Adjustment';
      //           // vendorEntity.status = ApplicationStatus.ADJUSTMENT;

      //         }
      //       }
      //     }
      //     if (abis.length > 0) vendorEntity.areasOfBusinessInterest = abis;
      //   }
      //   if (vendorEntity) vendorEntity.businessAreas = null;
      // }

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
            category: In(['goods', 'services']),
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
      const url = `https://dev-bo.megp.peragosystems.com/administration/api/tax-payers/${mbrsDataDto.tin}/${mbrsDataDto.issuedDate}`;
      console.log(url);
      const result = await axios.get(url);
      if (!result) return null;
      return result;
      // commented because mbrs api is not working
      // const mbrsurl = `https://dev-bo.megp.peragosystems.com/administration/api/customer-bussines-infos/${mbrsDataDto.tinNumber}/${mbrsDataDto.licenseNumber}`;
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
      const url = `https://dev-bo.megp.peragosystems.com/administration/api/ncic-vendors/${tinNumber}`;
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
      const url = `https://dev-bo.megp.peragosystems.com/administration/api/fppa-vendors/${tinNumber}`;
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
    if (!result) throw new HttpException('vendor not found', 500);
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
      if (!result) throw new HttpException('vendor not found ', 404);
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
          return result;
        } else {
          const gotoNextDto = new GotoNextStateDto();
          gotoNextDto.action = 'ISR';
          gotoNextDto.instanceId = ba.instanceId;
          const result = await this.workflowService.gotoNextStep(
            gotoNextDto,
            user,
          );
          return result;
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
              category: In(['goods', 'services', 'works']),
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
        country: true,
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
      const business = BusinessAreaDetailResponseDto.toResponse(ba);
      delete business.status;
      const priceRange = this.commonService.formatPriceRange(business);
      for (const lob of vendorData.areasOfBusinessInterest) {
        if (lob.category == business.category) {
          business.lineOfBusiness = lob.lineOfBusiness.map(
            (item: any) => item.name,
          );
          business.priceRange = priceRange;
          delete business.valueFrom;
          delete business.valueTo;
          delete business.service;
          break;
        }
      }
      bussinessAreas.push(business);
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
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.filter(
            (element) => element.category === value.category,
          )[0],
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
              category: In(['goods', 'services', 'works']),
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
          areaOfBusinessInterest: vendorEntity.areasOfBusinessInterest.filter(
            (element) => element.category === row.category,
          )[0],
        });
      }

      const onProgressRequests =
        await this.baService.getBusinessAreaByInstanceIds(baInstanceIds);
      const selectedServices = [];
      onProgressRequests.map((row) => {
        const oldBaId = bas.filter((item) => item.instanceId == row.instanceId);
        selectedServices.push({
          businessAreaId: row.id,
          pricingId: row.priceRangeId,
          invoiceId: row.invoice.id,
          _businessAreaId: oldBaId[0].id,
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
          country: vendor.country,
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
        const res = await this.profileInfoRepository.save(profileInfoEntity);
        if (!res) throw new HttpException('Profile update save failed ', 500);
      } else if (
        updateInfo.status == VendorStatusEnum.ACTIVE ||
        updateInfo.status == VendorStatusEnum.DRAFT
      ) {
        updateInfo.profileData = profileData;
        updateInfo.status = 'Submitted';
        const resultData = await this.profileInfoRepository.save(updateInfo);
        if (!resultData)
          throw new HttpException('saving submission failed', 500);
      } else if (updateInfo.status == VendorStatusEnum.ADJUSTMENT) {
        updateInfo.status = 'Submitted';
        updateInfo.profileData = profileData;
        const resultData = await this.profileInfoRepository.save(updateInfo);
        if (!resultData)
          throw new HttpException('Updating profile info failed', 500);
        const response = this.goToworkflow(userInfo, resultData);
        return response;
      }
      const wfi = new CreateWorkflowInstanceDto();
      wfi.user = userInfo;
      const bp = await this.bpService.findBpWithServiceByKey(
        VendorStatusEnum.PROFILE_UPDATE_KEY,
      );
      if (!this.bpService)
        throw new HttpException('bp service with this key notfound', 500);
      wfi.bpId = bp.id;
      wfi.serviceId = bp.serviceId;
      wfi.requestorId = vendor.id;
      wfi.data = { ...profileData };
      const workflowInstance =
        await this.workflowService.intiateWorkflowInstance(wfi, userInfo);
      if (!workflowInstance)
        throw new HttpException('workflow initiation failed', 500);
      const businessAreaEntity = new BusinessAreaEntity();
      businessAreaEntity.instanceId = workflowInstance.application.id;
      businessAreaEntity.category = ServiceKeyEnum.PROFILE_UPDATE;
      businessAreaEntity.serviceId = bp.serviceId;
      businessAreaEntity.applicationNumber =
        workflowInstance.application.applicationNumber;
      businessAreaEntity.status = VendorStatusEnum.PENDING;
      businessAreaEntity.vendorId = vendor.id;
      businessAreaEntity.status = 'Pending';
      const res = await this.businessAreaRepository.save(businessAreaEntity);
      if (!res) throw new HttpException('failed to add business area', 500);
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
    if (!ba) throw new HttpException('business area update failed', 500);
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
}
