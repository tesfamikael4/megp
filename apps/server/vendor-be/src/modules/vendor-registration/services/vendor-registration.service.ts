import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
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
  ServicePrice,
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
import {
  ServiceKeyEnum,
  WorkflowInstanceEnum,
} from 'src/modules/handling/dto/workflow-instance.enum';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { FppaDataDto, MbrsData, NCICDataDto } from '../dto/mbrsData.dto';
import { GenerateInvoice } from '../dto/invoice.dto';
import {
  IsrVendorDetailResponseDto,
  IsrVendorsResponseDto,
} from '../dto/isrvendor.dto';
import { BusinessAreaDetailResponseDto } from '../dto/business-area.dto';
import { BankAccountDetailResponse } from '../dto/bank-account-detail.dto';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly invoiceService: InvoiceService,
    private readonly httpService: HttpService,
    private readonly pricingService: ServicePricingService,
  ) {
    super(vendorRepository);
  }
  private updateVendorEnums = [
    VendorStatusEnum.ACTIVE,
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.COMPLETED,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.APPROVED,
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
            });
            businessArea.status = VendorStatusEnum.PENDING;
            const res = await this.businessAreaRepository.save(businessArea);
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
          data.paymentReceipt = [];
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
            result.basic['id'] = result.id;
            try {
              const invoice = await this.invoiceService.generateInvoice(
                data.areasOfBusinessInterest[index].priceRange,
                userInfo,
                result.basic,
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
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const businessArea = await this.businessAreaRepository.findOne({
        where: {
          vendorId: vendorStatusDto.isrVendorId,
          instanceId: vendorStatusDto.instanceId,
          //expireDate: nextYear,
        },
      });
      if (!businessArea) throw new HttpException(`businessArea_not_found`, 500);
      businessArea.status = VendorStatusEnum.APPROVED;
      businessArea.approvedAt = new Date();
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 1);
      businessArea.expireDate = expireDate;
      businessArea.remark = vendorStatusDto.remark;
      const besinessArea = await this.businessAreaRepository.save(businessArea);
      if (!besinessArea)
        throw new HttpException(`business_area_update_failed`, 500);
      return besinessArea;
    } else if (vendorStatusDto.status == VendorStatusEnum.REJECT) {
      return await this.rejectVendor(vendorStatusDto);
    }
  }
  async rejectVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In(this.updateVendorEnums),
      },
    });
    if (!result) throw new HttpException(`isr_Vendor_not_found`, 500);
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
      const vendorservice = await this.businessAreaRepository.findOne({
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
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
      },
    });
    if (!vendorEntity) return { level: 'basic', status: 'new' };

    const basic: any = JSON.parse(JSON.stringify(vendorEntity.basic));
    const initial: any = JSON.parse(JSON.stringify(vendorEntity.initial));
    const areasOfBusinessInterest: any = JSON.parse(
      JSON.stringify(vendorEntity.areasOfBusinessInterest),
    );
    const areaOfBusinessInterest = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorEntity.id,
        status: In([
          VendorStatusEnum.PENDING,
          VendorStatusEnum.COMPLETED,
          VendorStatusEnum.ADJUSTMENT,
          VendorStatusEnum.APPROVED,
          VendorStatusEnum.SUBMITTED,
        ]),
      },
    });
    const servicesInterface = areaOfBusinessInterest;
    return {
      name: basic?.name,
      tinNumber: basic?.tinNumber,
      level: initial?.level,
      vendorStatus: vendorEntity.status,
      Status: initial?.status,
      areasOfBusinessInterest: areasOfBusinessInterest,
      services: servicesInterface,
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
      status: WorkflowInstanceEnum.Approved,
    });
    const [items, total] = await dataQuery.getManyAndCount();
    const response = new DataResponseFormat<VendorInitiationResponseDto>();
    response.items = items.map((item) =>
      VendorInitiationResponseDto.toResponse(item),
    );
    response.total = total;
    return response;
  }

  async GetMBRSData(mbrsDataDto: any) {
    try {
      const url = `https://dev-bo.megp.peragosystems.com/api/tax-payers/${mbrsDataDto.tinNumber}/${mbrsDataDto.issuedDate}`;
      const response = await axios.get(url);
      if (!response) throw new HttpException(`not found in mbra`, 500);
      const mbrsurl = `https://dev-bo.megp.peragosystems.com/api/customer-bussines-infos/${mbrsDataDto.tin}/${mbrsDataDto.licenseNumber}`;
      const mbrsResponse = await axios.get(url);
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
      console.log(error);
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
      const url = `https://dev-bo.megp.peragosystems.com/api/fppa-vendors/${tinNumber}`;
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
  async startRenewal(userId: string) {
    const result = await this.vendorRepository.findOne({
      where: {
        userId: userId,
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
  async invoiceGenerateService(data: GenerateInvoice) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: data.userInfo.id },
      });
      data.basic = result.basic;
      const invoice = await this.invoiceService.generateInvoice(
        data.priceRangeId,
        data.userInfo,
        data.basic,
      );
      if (!result) throw new HttpException('invoice generation failed', 500);
      return invoice;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async vendorServiceRenewal(userInfo: any, serviceId: any) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!result) throw new HttpException('vendor_not_found', 500);
      if (result.initial.status.trim() !== VendorStatusEnum.SUBMITTED) {
        // const isrVendor = await this.fromInitialValue(data);
        // const result = await this.isrVendorsRepository.save(isrVendor);
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        // const response = [];

        let interests = null;

        if (result.areasOfBusinessInterest?.length <= 0)
          throw new HttpException('areasOfBusinessInterest_notfound', 500);

        let bp = null;
        for (
          let index = 0;
          index < result.areasOfBusinessInterest?.length;
          index++
        ) {
          bp = await this.bpService.findBpService(
            result.areasOfBusinessInterest[index].priceRange,
          );
          if (!bp) {
            throw new NotFoundException('Business_Process_Not_Found');
          }
          if (bp.serviceId == serviceId) {
            interests = result.areasOfBusinessInterest[index];
            wfi.bpId = bp.id;
            wfi.serviceId = bp.serviceId;
            break;
          }
        }
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
        if (!response)
          throw new HttpException('workflow_initiation_failed', 500);
        result.status = VendorStatusEnum.SUBMITTED;
        result.initial.status = VendorStatusEnum.SUBMITTED;
        result.initial.level = VendorStatusEnum.SUBMITTED;
        const res1 = await this.isrVendorsRepository.save(result);
        if (!res1) throw new HttpException(`isr_vendor_submission_failed`, 500);
        return response;
      } else {
        throw new HttpException('already Submitted ', 500);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async vendorServiceUpgrade(userInfo: any, areaOfBusinessInterest: any) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id },
      });
      if (!result) throw new HttpException('vendor_not_found', 500);
      if (result.status.trim() !== VendorStatusEnum.SUBMITTED) {
        // const isrVendor = await this.fromInitialValue(data);
        // const result = await this.isrVendorsRepository.save(isrVendor);
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        // const response = [];
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
  async updateVendorForUpgradeAndRenewal(
    areaOfBusinessInterest: any,
    userInfo: any,
  ) {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: userInfo.id,
      },
    });
    result.initial.level = VendorStatusEnum.PAYMENT;
    result.initial.status = VendorStatusEnum.DRAFT;
    const data = new GenerateInvoice();
    data.basic = result.basic;
    data.priceRangeId = areaOfBusinessInterest.priceRangeId;
    data.userInfo = userInfo;
    const res = await this.invoiceGenerateService(data);
    if (!res) throw new HttpException('invoice Generation failed', 500);
    result.areasOfBusinessInterest = [areaOfBusinessInterest];
    const isrVendor = await this.isrVendorsRepository.save(result);
    if (!isrVendor) throw new HttpException('isr vendor update failed', 500);
    return result;
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
        status: WorkflowInstanceEnum.Rejected,
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
      where: { id: VendorId, status: WorkflowInstanceEnum.Rejected },
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
            level: 'info',
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
  async submitServiceRenewal(userInfo: any, BusinessArea: any) {
    const response = [];
    const isrVendorData = await this.isrVendorsRepository.findOne({
      where: { userId: userInfo.id },
    });
    try {
      for (let index = 0; index < BusinessArea?.length; index++) {
        const businessAreaData = await this.businessAreaRepository.findOne({
          where: { id: BusinessArea[index] },
          relations: { servicePrice: true, BpService: true },
        });

        const bpservice = await this.bpService.findBpService(
          businessAreaData.priceRangeId,
        );
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;
        wfi.bpId = bpservice.id;
        wfi.serviceId = bpservice.service.id;
        wfi.requestorId = isrVendorData.id;
        wfi.data = isrVendorData;
        const workflowInstance =
          await this.workflowService.intiateWorkflowInstance(wfi, userInfo);
        if (!workflowInstance)
          throw new HttpException(`workflow_initiation_failed`, 500);
        response.push({
          applicationNumber: workflowInstance.application.applicationNumber,
          instanceNumber: workflowInstance.application.id,
          vendorId: workflowInstance.application.requestorId,
        });
        const businessAreaEntity = new BusinessAreaEntity();
        businessAreaEntity.instanceId = workflowInstance.application.id;
        businessAreaEntity.category = businessAreaData.category;
        businessAreaEntity.serviceId = bpservice.service.id;
        businessAreaEntity.applicationNumber =
          workflowInstance.application.applicationNumber;
        businessAreaEntity.status = VendorStatusEnum.PENDING;
        businessAreaEntity.vendorId = isrVendorData.id;
        businessAreaEntity.priceRangeId = businessAreaData.priceRangeId;
        const res = await this.businessAreaRepository.save(businessAreaEntity);
        if (!res) throw new HttpException(`adding_business_area_failed`, 500);
      }
      if (!response) throw new HttpException('workflow_initiation_failed', 500);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async generateInvoiceForServiceRenewal(userInfo: any, priceRangeId: any) {
    const response = [];
    const isrVendorData = await this.isrVendorsRepository.findOne({
      where: { userId: userInfo.id },
    });
    try {
      isrVendorData.basic['id'] = isrVendorData.id;
      try {
        const invoice = await this.invoiceService.generateInvoice(
          priceRangeId,
          userInfo,
          isrVendorData.basic,
        );
        if (!invoice) throw new HttpException('invoice_creation_failed', 500);

        response.push(invoice);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    return response;
  }
  async generateInvoiceForServiceUpgrade(
    userInfo: any,
    currentpriceRangeId: any,
    oldBusinessAreaEntity: BusinessAreaEntity,
  ) {
    const response = [];
    const isrVendorData = await this.isrVendorsRepository.findOne({
      where: { userId: userInfo.id },
    });
    try {
      isrVendorData.basic['id'] = isrVendorData.id;
      try {
        // currentPriceRange: string,
        //   user: any,
        //     vendor: any,
        //       businessArea: BusinessAreaEntity

        const invoice = await this.invoiceService.generateInvoiceForUpgrade(
          currentpriceRangeId,
          userInfo,
          isrVendorData.basic,
          oldBusinessAreaEntity,
        );
        if (!invoice) throw new HttpException('invoice_creation_failed', 500);

        response.push(invoice);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    return response;
  }
  async getServiceInvoiceForRenewal(userInfo: any, data: any) {
    try {
      if (
        data?.status == VendorStatusEnum.DRAFT ||
        data?.level == VendorStatusEnum.INFO
      ) {
        for (let index = 0; index < data.data.length; index++) {
          const businessAreaId = data.data[index].id;
          const businessareaData = await this.businessAreaRepository.findOne({
            where: { id: businessAreaId },
            relations: { BpService: true, servicePrice: true },
          });
          // commented for testing purpose
          // if (this.monthDiff(businessareaData.expireDate, new Date()) > 3)
          //   throw new HttpException('renewal period not allowed ', 500);
          if (
            businessareaData.BpService.key ===
              ServiceKeyEnum.goodsNewRegistration ||
            businessareaData.BpService.key ===
              ServiceKeyEnum.servicesNewRegistration ||
            businessareaData.BpService.key ===
              ServiceKeyEnum.worksNewRegistration
          ) {
            const key = await this.mapServiceType(businessAreaId, 'renewal');
            const renewalRange =
              await this.pricingService.findserviceByRangeAndKey(
                key,
                businessareaData.servicePrice.valueFrom,
                businessareaData.servicePrice.valueTo,
              );

            const { id, ...other } = data.data[index];
            const business = await this.businessAreaRepository.findOne(id);
            const service = await this.bpService.findBpWithServiceByKey(key);
            business.id = undefined;
            business.serviceId = service.serviceId;
            business.priceRangeId = renewalRange[0].id;
            const resu = await this.businessAreaRepository.save(business);

            if (!resu)
              throw new HttpException('business area update failed', 500);

            const result = await this.generateInvoiceForServiceRenewal(
              userInfo,
              renewalRange[0].id,
            );
          } else {
            const result = await this.generateInvoiceForServiceRenewal(
              userInfo,
              businessareaData.priceRangeId,
            );
          }
        }
      }
      const invoices = await this.invoiceService.getActiveMyInvoices(
        userInfo.id,
      );
      const isrVendor = await this.isrVendorsRepository.findOne({
        where: { userId: userInfo.id },
      });
      return { ...invoices, paymentReceipt: isrVendor.paymentReceipt };
    } catch (error) {
      console.log(error);
    }
  }
  async getMyInvoices(userId) {
    const invoices = await this.invoiceService.getActiveMyInvoices(userId);
    return invoices;
  }
  async getNewRenewalServices(vendorId) {
    const result = await this.businessAreaRepository.find({
      where: { status: VendorStatusEnum.PENDING, vendorId: vendorId },
    });
    return result;
  }
  async getServiceInvoiceForUpgrade(userInfo: any, data: any) {
    try {
      if (
        data?.status == VendorStatusEnum.DRAFT ||
        data?.level == VendorStatusEnum.INFO
      ) {
        for (let index = 0; index < data.data?.length; index++) {}
        for (let index = 0; index < data.data.length; index++) {
          const businessAreaId = data.data[index].id;
          const businessareaData = await this.businessAreaRepository.findOne({
            where: { id: businessAreaId },
            relations: { BpService: true, servicePrice: true },
          });
          // commented for testing purpose
          // if (this.monthDiff(businessareaData.expireDate, new Date()) > 3)
          //   throw new HttpException('renewal period not allowed ', 500);
          if (
            businessareaData.BpService.key ===
              ServiceKeyEnum.goodsNewRegistration ||
            businessareaData.BpService.key ===
              ServiceKeyEnum.servicesNewRegistration ||
            businessareaData.BpService.key ===
              ServiceKeyEnum.worksNewRegistration
          ) {
            const key = await this.mapServiceType(businessAreaId, 'renewal');
            const renewalRange =
              await this.pricingService.findserviceByRangeAndKey(
                key,
                businessareaData.servicePrice.valueFrom,
                businessareaData.servicePrice.valueTo,
              );

            const { id, ...other } = data.data[index];
            const oldBusiness = await this.businessAreaRepository.findOne(id);
            const business = oldBusiness;
            const service = await this.bpService.findBpWithServiceByKey(key);
            business.id = undefined;
            business.serviceId = service.serviceId;
            business.priceRangeId = renewalRange[0].id;
            const resu = await this.businessAreaRepository.save(business);

            if (!resu)
              throw new HttpException('business area update failed', 500);

            const result = await this.generateInvoiceForServiceUpgrade(
              userInfo,
              renewalRange[0].id,
              oldBusiness,
            );
          } else {
            const result = await this.generateInvoiceForServiceUpgrade(
              userInfo,
              businessareaData.priceRangeId,
              businessareaData,
            );
          }
        }
      }
      const invoices = await this.invoiceService.getActiveMyInvoices(
        userInfo.id,
      );
      return invoices;
    } catch (error) {
      throw error;
    }
  }
  async mapServiceType(businessAreaId, operationType: string) {
    const businessAreaData = await this.businessAreaRepository.findOne({
      where: { id: businessAreaId },
      relations: { servicePrice: true, BpService: true },
    });
    let key = '';
    if (operationType == 'renewal') {
      switch (businessAreaData.BpService.key) {
        case ServiceKeyEnum.goodsNewRegistration:
          key = ServiceKeyEnum.goodsRenewal;
          break;
        case ServiceKeyEnum.worksNewRegistration:
          key = ServiceKeyEnum.worksRenewal;
          break;
        case ServiceKeyEnum.servicesNewRegistration:
          key = ServiceKeyEnum.servicesRenewal;
          break;
        case ServiceKeyEnum.goodsUpgrade:
          key = ServiceKeyEnum.goodsRenewal;
          break;
        case ServiceKeyEnum.worksUpgrade:
          key = ServiceKeyEnum.worksRenewal;
          break;
        case ServiceKeyEnum.servicesUpgrade:
          key = ServiceKeyEnum.servicesRenewal;
          break;
        default:
          break;
      }
    } else if (operationType == 'upgrade') {
      switch (businessAreaData.BpService.key) {
        case ServiceKeyEnum.goodsNewRegistration:
          key = ServiceKeyEnum.goodsUpgrade;
          break;
        case ServiceKeyEnum.worksNewRegistration:
          key = ServiceKeyEnum.worksUpgrade;
          break;
        case ServiceKeyEnum.servicesNewRegistration:
          key = ServiceKeyEnum.servicesUpgrade;
          break;
        case ServiceKeyEnum.goodsRenewal:
          key = ServiceKeyEnum.goodsUpgrade;
          break;
        case ServiceKeyEnum.worksRenewal:
          key = ServiceKeyEnum.worksUpgrade;
          break;
        case ServiceKeyEnum.servicesRenewal:
          key = ServiceKeyEnum.servicesUpgrade;
          break;
        default:
          break;
      }
    }

    return key;
  }
  monthDiff(expireDate: Date, today: Date): number {
    let months;
    months = (today.getFullYear() - expireDate.getFullYear()) * 12;
    months -= expireDate.getMonth();
    months += today.getMonth();
    return months;
  }
}
