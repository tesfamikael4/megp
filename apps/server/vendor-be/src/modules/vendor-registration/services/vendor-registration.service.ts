import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { SetVendorStatus } from '../dto/vendor.dto';
import {
  VendorInitiationDto,
  VendorInitiationResponseDto,
} from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import {
  BusinessAreaEntity,
  InvoiceEntity,
  IsrVendorsEntity,
  VendorsEntity,
} from 'src/entities';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { InvoiceService } from './invoice.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import axios from 'axios';
import { FppaDataDto, MbrsData, NCICDataDto } from '../dto/mbrsData.dto';
import { IsrVendorsResponseDto } from '../dto/isrvendor.dto';
import { BusinessAreaDetailResponseDto } from '../dto/business-area.dto';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { BusinessAreaService } from './business-area.service';
import InitialValueSchema from '../dto/add-vendor.dto';
import { ProfileInfoEntity } from 'src/entities/profile-info.entity';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
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
    private readonly invoiceService: InvoiceService,
    private readonly pricingService: ServicePricingService,
    private readonly baService: BusinessAreaService,
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
    const resul = await this.isrVendorsRepository.findOne({
      where: { userId: userInfo.id },
    });
    if (!resul) throw new HttpException('vendor_not_found', 500);
    if (resul.status.trim() !== VendorStatusEnum.SUBMITTED) {
      const isrVendor = await this.fromInitialValue(data);
      const result = await this.isrVendorsRepository.save(isrVendor);
      const wfi = new CreateWorkflowInstanceDto();
      wfi.user = userInfo;
      const response = [];
      const interests = data.areasOfBusinessInterest;
      if (interests?.length <= 0)
        throw new HttpException('areasOfBusinessInterest_notfound', 500);
      for (let i = 0; i < interests.length; i++) {
        try {
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
              throw new HttpException(`workflow_initiation_failed`, 500);
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
              businessAreaEntity.instanceId = workflowInstance.application.id;
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
        } catch (error) {
          throw error;
        }
      }
      if (response.length == 0)
        throw new HttpException('areasOfBusinessInterest_notfound', 500);
      result.status = VendorStatusEnum.SUBMITTED;
      const initial = JSON.parse(JSON.stringify(result.initial));
      initial.status = VendorStatusEnum.SUBMITTED;
      initial.level = VendorStatusEnum.SUBMITTED;
      result.initial = initial;
      const res = await this.isrVendorsRepository.save(result);
      if (!res) throw new HttpException(`isr_vendor_submission_failed`, 500);
      return response;
    } else {
      throw new HttpException('already Submitted ', 500);
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
        if (!result) throw new HttpException(`adding_isr_failed`, 500);
        if (
          data.initial.level.trim() === VendorStatusEnum.PAYMENT &&
          data.initial.status.trim() === VendorStatusEnum.SAVE
        ) {
          for (
            let index = 0;
            index < data.areasOfBusinessInterest.length;
            index++
          ) {
            const vendor: VendorsEntity = new VendorsEntity();
            //  result.basic['id'] = result.id;
            vendor.id = result.id;
            vendor.name = result.basic['name'];
            try {
              const invoice = await this.invoiceService.generateInvoice(
                data.areasOfBusinessInterest[index].priceRange,
                vendor,
                userInfo,
              );

              if (!invoice)
                throw new HttpException('invoice_creation_failed', 500);
            } catch (error) {
              throw error;
            }
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
      throw new HttpException('vendor_already_submitted', 500);
    if (vendorsEntity.status === VendorStatusEnum.APPROVED)
      throw new HttpException('vendor_already_approved', 500);

    // if (initial.status == VendorStatusEnum.SUBMITTED)
    //   throw new BadRequestException(`already_submitted`);
    initial.status =
      data.initial.status == 'Submit' ? 'Draft' : data.initial.status;
    vendorsEntity.initial = data.initial;
    // vendorsEntity.initial = data.initial;
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
        businessArea.status = VendorStatusEnum.APPROVED;
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
      if (upgradeServices.length == 0) {
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
      return businessUpdate;
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
          };
          vendorEntity.metaData = tempMetadata;
          try {
            const res = await this.vendorRepository.save(vendorEntity);
            if (!res) throw new HttpException(`vendor_insertion_failed`, 500);
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
        if (!besinessArea)
          throw new HttpException(`business_area_update_failed`, 500);
        return besinessArea;
      } else if (vendorStatusDto.status == VendorStatusEnum.REJECT) {
        return await this.rejectVendor(vendorStatusDto);
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
    // if vendor have no previously approved service
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
      const initial = JSON.parse(JSON.stringify(result.initial));
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
    return businessArea;
  }
  async adjustVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
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
    // return { msg: 'Success' };
  }
  async vendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
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
    };
    vendorsEntity.initial = JSON.parse(JSON.stringify(initial));
    vendorsEntity.basic = JSON.parse(JSON.stringify(vendorInitiationDto));
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
  async getIsrVendorByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In(this.updateVendorEnums),
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
        isrVendor: { businessAreas: { status: In(['Approved', 'APPROVED']) } },
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
      const url = `https://dev-bo.megp.peragosystems.com/api/tax-payers/${mbrsDataDto.tinNumber}/${mbrsDataDto.issuedDate}`;
      await axios.get(url);
      // if (!response) throw new HttpException(`not found in mbra`, 500);
      const tin = '20202020';
      const licenseNumber = '12345';
      const mbrsurl = `https://dev-bo.megp.peragosystems.com/administration/api/customer-bussines-infos/${mbrsDataDto.tinNumber}/${mbrsDataDto.licenseNumber}`;
      const mbrsResponse = await axios.get(mbrsurl);
      if (!mbrsResponse) throw new HttpException(`not found in mbrs`, 500);
      const mbrsData: MbrsData = new MbrsData();
      mbrsData.businessLicenseNumber =
        mbrsResponse?.data?.businessLicenseNumber;
      mbrsData.businessName = mbrsResponse?.data?.businessName;
      mbrsData.dateRegistered = mbrsResponse?.data?.dateRegistered;
      mbrsData.firstName = mbrsResponse?.data?.firstName;
      mbrsData.lastName = mbrsResponse?.data?.lastName;
      mbrsData.legalStatus = mbrsResponse?.data?.legalStatus;
      mbrsData.middleName = mbrsResponse?.data?.middleName;
      mbrsData.nationality = mbrsResponse?.data?.nationality;
      mbrsData.organizationName = mbrsResponse?.data?.organizationName;
      mbrsData.tin = mbrsResponse?.data?.tin;
      return mbrsData;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  async GetNCICData(tinNumber: string) {
    try {
      const nCICDataDto: NCICDataDto = new NCICDataDto();
      const url = `https://dev-bo.megp.peragosystems.com/api/ncic-vendors/${tinNumber}`;
      const response = await axios.get(url);
      return response.data;
      if (!response) throw new HttpException('not found in ncic', 500);
      nCICDataDto.accountName = response?.data?.nCICDataDto;
      nCICDataDto.accountNo = response?.data?.accountNo;
      nCICDataDto.businessType = response?.data?.businessType;
      nCICDataDto.id = response?.data?.id;
      nCICDataDto.mobileNumber = response?.data?.mobileNumber;
      nCICDataDto.supplierCode = response?.data?.supplierCode;
      nCICDataDto.supplierName = response?.data?.supplierName;
      nCICDataDto.tin = response?.data?.tin;

      return nCICDataDto;
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
      return fppaDataDto;
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

  async upgradeVendorService(userInfo: any, areaOfBusinessInterest: any) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!result) throw new HttpException('vendor_not_found', 500);
      if (result.status.trim() !== VendorStatusEnum.SUBMITTED) {
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        const interests = areaOfBusinessInterest;
        if (interests)
          throw new HttpException('areasOfBusinessInterest_notfound', 500);

        const bp = await this.bpService.findBpService(interests.priceRange);
        if (!bp) {
          throw new NotFoundException('Business_Process_Not_Found');
        }
        wfi.bpId = bp.id;
        wfi.serviceId = bp.serviceId;
        wfi.requestorId = result.id;
        wfi.data = result;
        let workflowInstance = null;
        workflowInstance = await this.workflowService.intiateWorkflowInstance(
          wfi,
          userInfo,
        );
        if (!workflowInstance)
          throw new HttpException(`workflow_initiation_failed`, 500);
        const response = {
          applicationNumber: workflowInstance.application.applicationNumber,
          instanceNumber: workflowInstance.application.id,
          vendorId: workflowInstance.application.requestorId,
        };

        const businessAreaEntity = new BusinessAreaEntity();
        businessAreaEntity.instanceId = workflowInstance.application.id;
        businessAreaEntity.category = interests.category;
        businessAreaEntity.serviceId = bp.serviceId;
        businessAreaEntity.applicationNumber =
          workflowInstance.application.applicationNumber;
        businessAreaEntity.status = VendorStatusEnum.PENDING;
        businessAreaEntity.vendorId = result.id;
        businessAreaEntity.priceRangeId = interests.priceRange;
        const res = await this.businessAreaRepository.save(businessAreaEntity);
        if (!res) throw new HttpException(`adding_business_area_failed`, 500);

        if (!workflowInstance)
          throw new HttpException(`workflowInstanceService_failed`, 500);

        if (!response)
          throw new HttpException('workflow_initiation_failed', 500);
        result.status = VendorStatusEnum.SUBMITTED;
        result.initial.status = VendorStatusEnum.SUBMITTED;
        result.initial.level = VendorStatusEnum.SUBMITTED;
        // const data = await this.isrVendorsRepository.save(result);
        // if (!data) throw new HttpException(`isr_vendor_submission_failed`, 500);
        return response;
      } else {
        throw new HttpException('already Submitted ', 500);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getApprovedVendorById(VendorId: string) {
    const result = await this.vendorRepository.findOne({
      where: { id: VendorId },
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
        beneficialOwnership: { firstName: true, lastName: true, key: true },
        areasOfBusinessInterest: { category: true, lineOfBusiness: true },
        isrVendor: { id: true, businessAreas: true },
      },
      relations: {
        areasOfBusinessInterest: true,
        shareholders: true,
        beneficialOwnership: true,
        vendorAccounts: true,
        isrVendor: { businessAreas: { servicePrice: true, BpService: true } },
      },
    });

    const { isrVendor, ...rest } = result;
    const vendor = {
      ...rest,
      businessAreas: result.isrVendor.businessAreas.map((ba) =>
        BusinessAreaDetailResponseDto.toResponse(ba),
      ),
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
          isrVendor: { businessAreas: { status: VendorStatusEnum.APPROVED } },
        },
        relations: {
          isrVendor: { businessAreas: { servicePrice: true } },
          areasOfBusinessInterest: true,
        },
      });

      const bas = vendorEntity?.isrVendor?.businessAreas;
      const baInstanceIds = [];
      const baResponse = [];
      for (let i = 0; i < bas?.length; i++) {
        const row = bas[i];
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
      const onprogressRequests =
        await this.baService.getBusinessAreaByInstanceIds(baInstanceIds);
      const selectedServices = [];
      onprogressRequests.map((row) => {
        const oldBaId = bas.filter((item) => item.instanceId == row.instanceId);
        selectedServices.push({
          businessAreaId: row.id,
          pricingId: row.priceRangeId,
          invoiceId: row.invoice.id,
          _businessAreaId: oldBaId[0].id,
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
        await this.invoiceRepository.delete({ userId: user.id, paymentStatus: PaymentStatus.PENDING });
        await this.businessAreaRepository.delete({ vendorId: vendor.id, status: VendorStatusEnum.PENDING });
        await this.isrVendorsRepository.delete({ userId: user.id, status: Not(VendorStatusEnum.APPROVED) });
        return true;
      } else {
        await this.invoiceRepository.delete({ userId: user.id, paymentStatus: PaymentStatus.PENDING });
        await this.businessAreaRepository.delete({ vendorId: vendor.id, status: PaymentStatus.PENDING });
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

  async getVendorInformation(userId: string) {
    try {
      const status = 'Active';
      const vednor = await this.vendorRepository.findOne({
        where: { userId: userId },
      });
      if (!vednor) throw new NotFoundException('vendor not found');
      const result = await this.profileInfoRepository.findOne({
        where: { vendorId: vednor.id, status: 'Active' },
      });

      if (result == null) {
        const vendorEntity = await this.isrVendorsRepository.findOne({
          where: {
            userId: userId,
            status: In(['Approved']),
          },
        });
        if (!vendorEntity) throw new NotFoundException('vendor not found');
        return vendorEntity;
      } else {
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
  async submitVendorProfileUpdate(profileData: any, userInfo) {
    try {
      const result = await this.vendorRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!result) throw new NotFoundException('vendor not found');
      const updateInfo = await this.profileInfoRepository.findOne({
        where: { vendorId: result.id, status: VendorStatusEnum.ACTIVE },
      });
      if (updateInfo == null) {
        const profileInfoEntity = new ProfileInfoEntity();
        profileInfoEntity.vendorId = result?.id;
        profileInfoEntity.status = 'Submitted';
        profileInfoEntity.profileData = profileData;
        this.profileInfoRepository.save(profileInfoEntity);
      } else {
        updateInfo.profileData = profileData;
        updateInfo.status = 'Submitted';
        const resultData = this.profileInfoRepository.save(updateInfo);
        if (!resultData)
          throw new HttpException('saving submission failed', 500);
      }
      const wfi = new CreateWorkflowInstanceDto();
      wfi.user = userInfo;
      const bp = await this.bpService.findBpWithServiceByKey('ProfileUpdate');
      if (!this.bpService)
        throw new HttpException('bp service with this key notfound', 500);
      wfi.bpId = bp.id;
      wfi.serviceId = bp.serviceId;
      wfi.requestorId = result.isrVendorId;
      wfi.data = { ...profileData };
      const workflowInstance =
        await this.workflowService.intiateWorkflowInstance(wfi, userInfo);
      if (!workflowInstance)
        throw new HttpException('workflow initiation failed', 500);
      const businessAreaEntity = new BusinessAreaEntity();
      businessAreaEntity.instanceId = workflowInstance.application.id;
      businessAreaEntity.category = 'Profile Update';
      businessAreaEntity.serviceId = bp.serviceId;
      businessAreaEntity.applicationNumber =
        workflowInstance.application.applicationNumber;
      businessAreaEntity.status = VendorStatusEnum.PENDING;
      businessAreaEntity.vendorId = result.id;
      businessAreaEntity.priceRangeId = '892e1379-a66f-4c0b-8382-5b248840cae7';
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
}
