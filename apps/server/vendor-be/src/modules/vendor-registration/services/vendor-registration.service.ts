import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';
import { SetVendorStatus } from '../dto/vendor.dto';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
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
      if (response.length === 0) {
        const initial = JSON.parse(JSON.stringify(result.initial));
        initial.state = '';
        const res = await this.isrVendorsRepository.save(result);
      }
      result.status = VendorStatusEnum.SUBMITTED;
      const res = await this.isrVendorsRepository.save(result);
      if (!res) throw new HttpException(`isr_vendor_submission_failed`, 500);
      return response;
    } else {
      throw new HttpException('already Submitted ', 500);
    }
  }
  async addVendorInformations(data: any, userInfo: any): Promise<any> {
    if (
      data.initial.status == VendorStatusEnum.DRAFT ||
      data.initial.status == VendorStatusEnum.SAVE ||
      data.initial.status == VendorStatusEnum.SUBMIT
    ) {
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
            throw Error('invoice_generation_failed');
          }
        }
        return { msg: 'Success' };
      } else if (
        data.initial.level.trim() === VendorStatusEnum.SUBMIT &&
        data.initial.status.trim() === VendorStatusEnum.SUBMIT
      ) {
        return this.submitVendorInformations(data, userInfo);
      }
      return { msg: 'Success' };
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
      const basic = JSON.parse(JSON.stringify(isrVendorData.basic));
      const initial = JSON.parse(JSON.stringify(isrVendorData.initial));
      if (result.status !== VendorStatusEnum.COMPLETED) {
        initial.status = VendorStatusEnum.COMPLETED;
        initial.level = VendorStatusEnum.COMPLETED;
        result.status = VendorStatusEnum.APPROVED;
        result.initial = initial;
        const isrVendorUpdate = await this.isrVendorsRepository.save(result);
        if (!isrVendorUpdate)
          throw new BadRequestException(`isr_vendor_update_failed`);
        const vendorEntity = new VendorsEntity();
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
        vendorEntity.shareholders = JSON.parse(
          JSON.stringify(isrVendorData.shareHolders),
        );
        vendorEntity.vendorAccounts = JSON.parse(
          JSON.stringify(isrVendorData.bankAccountDetails),
        );
        vendorEntity.areasOfBusinessInterest = JSON.parse(
          JSON.stringify(isrVendorData.areasOfBusinessInterest),
        );
        vendorEntity.beneficialOwnership = JSON.parse(
          JSON.stringify(isrVendorData.beneficialOwnership),
        );
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
          if (!res) throw new BadRequestException(`vendor_insertion_failed`);
        } catch (error) {
          throw error;
        }
      }
      const businessArea = await this.businessAreaRepository.findOne({
        where: { vendorId: result.id, instanceId: vendorStatusDto.instanceId },
      });
      if (!businessArea) throw new HttpException(`businessArea_not_found`, 500);
      businessArea.status = VendorStatusEnum.APPROVED;
      businessArea.approvedAt = new Date();
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
      where: { vendorId: result.id, status: Not(VendorStatusEnum.REJECTED) },
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
  async updateVendors(vendorStatusDto: SetVendorStatus): Promise<any> {
    if (vendorStatusDto.status == VendorStatusEnum.ADJUST) {
      const res = this.adjustVendor(vendorStatusDto);
      if (res) return vendorStatusDto;
    } else {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In(this.updateVendorEnums),
        },
      });

      if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
      // if vendor have no previously approved service
      if (result.status !== VendorStatusEnum.COMPLETED) {
        const initial = JSON.parse(JSON.stringify(result.initial));
        initial.status = VendorStatusEnum.REJECTED;
        result.status = VendorStatusEnum.REJECTED;
        const resul = await this.isrVendorsRepository.save(result);
        if (!resul) throw new BadRequestException(`isrVendor_Update_failed`);
      } else {
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
          throw new BadRequestException(`business_area_rejection_failed`);
      }
      // return { msg: 'Success' };
      return vendorStatusDto;
    }
  }
  async adjustVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In(this.updateVendorEnums),
      },
    });

    if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
    const initial = JSON.parse(JSON.stringify(result?.initial));
    //if there is no previously approved service by the isr vendorId
    if (result.status !== VendorStatusEnum.COMPLETED) {
      initial.level = VendorStatusEnum.DETAIL;
      initial.status = VendorStatusEnum.DRAFT;
      result.status = VendorStatusEnum.ACTIVE;
      result.initial = initial;
      const resul = await this.isrVendorsRepository.save(result);

      if (!resul) throw new BadRequestException(`unable_to_save_isrVendor`);
    }
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
      throw Error('Vendor_info_not_saved');
    }
  }
  async getIsrVendorInvoiceByUserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: In(this.updateVendorEnums),
      },
    });
    if (!vendorEntity) {
      throw new HttpException('isr_vendor_not_found', HttpStatus.BAD_REQUEST);
    }
    const areaOfBusinessInterest = JSON.parse(
      JSON.stringify(vendorEntity.areasOfBusinessInterest),
    );
    const invoices = await this.getInvoices(areaOfBusinessInterest, userId);
    return { ...vendorEntity, invoice: invoices };
  }
  async getPendingIsrVendorByUserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: In([
          VendorStatusEnum.ACTIVE,
          VendorStatusEnum.ADJUSTMENT,
          VendorStatusEnum.REJECTED,
          VendorStatusEnum.APPROVED,
          VendorStatusEnum.SUBMITTED,
        ]),
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
      const vendorEntity = await this.vendorRepository.find({
        where: { userId: userId },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          instances: true,
          areasOfBusinessInterest: true,
        },
      });
      const invoice = await this.invoiceRepository.find({
        where: {
          userId: vendorEntity[0].id,
          paymentStatus: Not('Paid'),
        },
      });
      const vendorEntityRes = { ...vendorEntity[0], invoice: invoice };
      return vendorEntityRes;
    } catch (error) {
      throw Error(error);
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
      throw Error(error);
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
      throw Error(error);
    }
  }
  async getInvoices(areaOfBusinessInterest: any[], userId: string) {
    const invoice = [];
    for (let index = 0; index < areaOfBusinessInterest?.length; index++) {
      const element = await this.invoiceRepository.findOne({
        where: {
          userId: userId,
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
}
