import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';
import { SetVendorStatus, VendorsResponseDto } from '../dto/vendor.dto';
import { FileResponseDto } from '../dto/file.dto';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import {
  BusinessAreaEntity,
  FilesEntity,
  InvoiceEntity,
  IsrVendorsEntity,
  VendorsEntity,
} from 'src/entities';
import { WorkflowInstanceService } from 'src/modules/handling/services/workflow-instance.service';
import initialValueSchema from '../dto/add-vendor.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { error } from 'console';
import { errorExecution } from 'xstate/lib/actionTypes';

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
    private readonly dataSource: DataSource, // private readonly workflowInstanceService: WorkflowInstanceService,
    private readonly workflowService: WorkflowService,
    private readonly workflowInstanceService: WorkflowInstanceService,
    private readonly bpService: BusinessProcessService,
  ) {
    super(vendorRepository);
  }
  async addVendorInformations(data: any, userInfo: any): Promise<any> {
    if (
      data.initial.status == VendorStatusEnum.SAVEASDRAFT ||
      data.initial.status == VendorStatusEnum.SAVE ||
      data.initial.status == VendorStatusEnum.SUBMIT
    ) {
      const result = await this.isrVendorsRepository.save(
        await this.fromInitialValue(data),
      );

      console.log("data.initial.level ", data.initial.level);
      console.log("data.initial.status ", data.initial.status);
      console.log("data.areasOfBusinessInterest", data.areasOfBusinessInterest);

      if (!result) throw new HttpException(`adding_isr_failed`, 500);
      if (
        data.initial.level == VendorStatusEnum.PPDA &&
        data.initial.status == VendorStatusEnum.SAVE
      ) {
        for (
          let index = 0;
          index < data.areasOfBusinessInterest.length;
          index++
        ) {
          const invoice =
            await this.workflowInstanceService.generateVendorInvoice(
              result.id,
              data.areasOfBusinessInterest[index].priceRange,
            );
          if (!invoice) throw new HttpException('invoice_creation_failed', 500);
        }
        return { msg: 'Success' };
      } else if (
        data.initial.status == VendorStatusEnum.SUBMIT &&
        data.initial.level == VendorStatusEnum.SUBMIT
      ) {
        const wfi = new CreateWorkflowInstanceDto();
        wfi.user = userInfo;

        const instances = [];
        const response = [];
        const interests = data.areasOfBusinessInterest;
        for (let i = 0; i < interests.length; i++) {
          try {
            const bp = await this.bpService.findBpService(
              interests[i].priceRange,
            );

            if (!bp) {
              throw new NotFoundException('Business Process Not Found');
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
                status: VendorStatusEnum.PENDING,
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
            } else {
              workflowInstance =
                await this.workflowService.intiateWorkflowInstance(
                  wfi,
                  userInfo,
                );
            }

            if (!workflowInstance)
              throw new BadRequestException(`workflowInstanceService_failed`);
            instances.push(workflowInstance);
            response.push({
              applicationNumber: workflowInstance.application.applicationNumber,
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
            const res = await this.addBusinessArea(businessAreaEntity);
            if (!res)
              throw new BadRequestException(`adding_business_area_failed`);
          } catch (error) {
            console.log(error);
          }
        }
        return response;
      }
      return { msg: 'Success' };
    }
  }

  fromInitialValue = async (data: any) => {
    console.log("data", data);
    let vendorsEntity: IsrVendorsEntity = null;
    vendorsEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: data.initial.userId
        ///status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });
    if (!vendorsEntity) throw new NotFoundException('vendor_not_found!!');
    const initial = JSON.parse(JSON.stringify(vendorsEntity.initial));

    if (initial.status == VendorStatusEnum.SUBMITTED)
      throw new BadRequestException(`already_submitted`);
    initial.status =
      data.initial.status == 'Submit' ? 'Save as Draft' : data.initial.status;
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
  async approveVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In([
          VendorStatusEnum.ACTIVE,
          VendorStatusEnum.ADJUSTMENT,
          VendorStatusEnum.COMPLETED,
        ]),
      },
    });
    if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
    const isrVendorData = result;
    const basic = JSON.parse(JSON.stringify(isrVendorData.basic));
    const initial = JSON.parse(JSON.stringify(isrVendorData.initial));
    if (result.status !== VendorStatusEnum.COMPLETED) {
      initial.status = VendorStatusEnum.COMPLETED;
      initial.level = VendorStatusEnum.COMPLETED;
      result.status = VendorStatusEnum.COMPLETED;
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
      } catch (error) { }
    }
    const businessArea = await this.businessAreaRepository.findOne({
      where: { vendorId: result.id, instanceId: vendorStatusDto.instanceId },
    });
    if (!businessArea) throw new BadRequestException(`businessArea_not_found`);
    businessArea.status = VendorStatusEnum.APPROVED;
    businessArea.remark = vendorStatusDto.remark;
    const besinessArea = await this.businessAreaRepository.save(businessArea);
    if (!besinessArea)
      throw new BadRequestException(`business_area_update_failed`);
    return besinessArea;
  }
  async updateVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    if (vendorStatusDto.status == VendorStatusEnum.ADJUST) {
      const res = this.adjustmentVendor(vendorStatusDto);
      if (res) return vendorStatusDto;
    } else {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In([
            VendorStatusEnum.ACTIVE,
            VendorStatusEnum.ADJUSTMENT,
            VendorStatusEnum.COMPLETED,
          ]),
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
          throw new BadRequestException(`businessArea_not_found`);
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
  async adjustmentVendor(vendorStatusDto: SetVendorStatus): Promise<any> {
    const result = await this.isrVendorsRepository.findOne({
      where: {
        userId: vendorStatusDto.userId,
        status: In([
          VendorStatusEnum.ACTIVE,
          VendorStatusEnum.ADJUSTMENT,
          VendorStatusEnum.COMPLETED,
        ]),
      },
    });

    if (!result) throw new NotFoundException(`isr_Vendor_not_found`);
    const initial = JSON.parse(JSON.stringify(result?.initial));
    console.log(result);
    //if there is no previously approved service by the isr vendorId
    if (result.status !== VendorStatusEnum.COMPLETED) {
      initial.level = VendorStatusEnum.DETAIL;
      initial.status = VendorStatusEnum.SAVEASDRAFT;
      result.initial = initial;
      const resul = await this.isrVendorsRepository.save(result);
      if (!resul) throw new BadRequestException(`Unable_to_save_isrVendor`);

      return resul;
    } else {
      //if there isx  previously approved service by the vendorId
      initial.level = VendorStatusEnum.PPDA;
      initial.status = VendorStatusEnum.SAVEASDRAFT;
      const currentBusinessArea = await this.businessAreaRepository.findOne({
        where: { vendorId: result.id, instanceId: vendorStatusDto.instanceId },
      });
      if (!currentBusinessArea)
        throw new BadRequestException(`businessArea_not_found`);
      currentBusinessArea.status = vendorStatusDto.status;
      currentBusinessArea.remark = vendorStatusDto.remark;
      const businessArea =
        await this.businessAreaRepository.save(currentBusinessArea);
      if (!businessArea)
        throw new BadRequestException(`business_area_update_failed`);
      return businessArea;
    }
    // return { msg: 'Success' };
  }
  async updateVendorStatus(
    vendorId: string,
    vendorStatus: string,
  ): Promise<any> {
    const resul = await this.vendorRepository.update(vendorId, {
      status: vendorStatus,
    });
    if (!resul) throw new BadRequestException(`isrVendor_Update_failed`);
    return true;
  }
  async updateIsrVendorStatus(isrVendorId: string, initial: any): Promise<any> {
    const resul = await this.isrVendorsRepository.update(isrVendorId, {
      initial: initial,
    });
    if (!resul) throw new BadRequestException(`isrVendor_Update_failed`);
    return true;
  }
  async vendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
    const vendor = await this.isrVendorsRepository.findOne({
      where: {
        userId: userInfo.id,
        status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });
    if (vendor) return { id: vendor.id, message: "vendor existed" };
    const vendorByTinExists = await this.isrVendorsRepository.findOne({
      where: { tinNumber: vendorInitiationDto.tinNumber },
    });
    if (vendorByTinExists) return { tin: vendorInitiationDto.tinNumber, message: 'TIN already already exist' };

    const vendorsEntity = new IsrVendorsEntity();
    vendorsEntity.userId = userInfo.id;
    vendorsEntity.tinNumber = vendorInitiationDto.tinNumber;
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
      throw new Error('Vendor info not saved');
    }
  }

  async addBusinessArea(businessAreaEntity: BusinessAreaEntity): Promise<any> {
    try {
      const result = await this.businessAreaRepository.save(businessAreaEntity);
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getIsrVendorInvoiceByUserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });

    if (!vendorEntity) {
      throw new HttpException('isr_vendor_not_found', HttpStatus.BAD_REQUEST);
    }

    const areaOfBusinessInterest = JSON.parse(
      JSON.stringify(vendorEntity.areasOfBusinessInterest),
    );
    const invoice = await this.getInvoices(areaOfBusinessInterest, userId);
    return { ...vendorEntity, invoice: invoice };
  }

  async getCompletedIsrVendorByuserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In([VendorStatusEnum.COMPLETED]),
        },
      });
      return vendorEntity;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorByUserId(userId: string): Promise<typeof initialValueSchema> {
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
          payerAccountId: vendorEntity[0].id,
          paymentStatus: Not('Paid'),
        },
      });
      const vendorEntityRes = { ...vendorEntity[0], invoice: invoice };
      return this.toInitialValue(vendorEntityRes);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getPendingIsrVendorByuserId(userId: string): Promise<any> {
    const vendorEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: userId,
        status: In([
          VendorStatusEnum.ACTIVE,
          VendorStatusEnum.ADJUSTMENT,
          VendorStatusEnum.REJECTED,
        ]),
      },
    });
    if (!vendorEntity) return { level: 'basic', status: 'new' };

    const basic: any = JSON.parse(JSON.stringify(vendorEntity.basic));
    const initial: any = JSON.parse(JSON.stringify(vendorEntity.initial));
    const areasOfBusinessInterest: any = JSON.parse(
      JSON.stringify(vendorEntity.areasOfBusinessInterest),
    );
    const servicesInterface = [];
    const areaOfBusinessInterest = await this.businessAreaRepository.find({
      where: {
        vendorId: vendorEntity.id,
        status: In([
          VendorStatusEnum.PENDING,
          VendorStatusEnum.COMPLETED,
          VendorStatusEnum.ADJUSTMENT,
        ]),
      },
    });
    // if (!areaOfBusinessInterest)
    //   throw new BadRequestException(`business_area_not_found`);
    for (let index = 0; index < areaOfBusinessInterest?.length; index++) {
      servicesInterface.push({
        serviceStatus: areaOfBusinessInterest[index]?.status,
        serviceRemark: areaOfBusinessInterest[index]?.remark,
        category: areaOfBusinessInterest[index]?.category,
        trackingNumbe: areaOfBusinessInterest[index]?.applicationNumber,
      });
    }
    return {
      name: basic?.name,
      tinNumber: basic?.tinNumber,
      level: initial?.level,
      vendorStatus: initial?.status,
      areasOfBusinessInterest: areasOfBusinessInterest,
      services: servicesInterface,
    };
  }

  async getIsrVendorByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In([
            VendorStatusEnum.ACTIVE,
            VendorStatusEnum.ADJUSTMENT,
            VendorStatusEnum.COMPLETED,
          ]),
        },
      });

      if (!vendorEntity) {
        throw new HttpException('vendor_not_found', HttpStatus.BAD_REQUEST);
      }
      return vendorEntity;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getInvoices(areaOfBusinessInterest: any[], userId: string) {
    const invoice = [];
    for (let index = 0; index < areaOfBusinessInterest?.length; index++) {
      const element = await this.invoiceRepository.findOne({
        where: {
          payerAccountId: userId,
          pricingId: areaOfBusinessInterest[index].priceRange,
        },
      });
      if (!element) throw new BadRequestException(`invoice_not_created`);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(new Date().getDate() - 14);
      const expired = element.createdOn < fourteenDaysAgo;
      invoice.push({ ...element, expired: expired });
    }

    return invoice;
  }
  async getVendorStatusByVendorId(userId: string): Promise<any> {
    try {
      const vendorStatus = await this.vendorRepository.findOne({
        select: ['status'],
        where: { userId: userId },
      });
      return { vendorStatus: vendorStatus.status };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async addVendorAreaOfInterestByVendorId(
    createAreasOfBusinessInterest: CreateAreasOfBusinessInterest[],
  ): Promise<any> {
    try {
      const result = await this.vendorRepository.findOne({
        where: { userId: createAreasOfBusinessInterest[0].userId },
        relations: { areasOfBusinessInterest: true },
      });
      if (!result)
        return `User  with Id ${createAreasOfBusinessInterest[0].userId} does not Have an active Vendor  `;
      result.areasOfBusinessInterest = CreateAreasOfBusinessInterest.fromDtos(
        createAreasOfBusinessInterest,
      );
      return this.vendorRepository.save(result);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorById(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneOrFail({
        where: { id: vendorId },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          areasOfBusinessInterest: true,
          customCats: true,
          businessCats: true,
        },
      });
      const files = await this.dataSource
        .getRepository(FilesEntity)
        .find({ where: { vendorId: vendorId } });
      const filesResponse = files.map((item) => {
        return FileResponseDto.toResponseDto(item);
      });
      const vendorDto = VendorsResponseDto.fromEntity(vendorEntity);
      vendorDto['attachments'] = filesResponse;
      return vendorDto;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getIsrVendors(): Promise<any[]> {
    try {
      const vendorEntity = await this.isrVendorsRepository.find();
      return vendorEntity;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async setVendorStatus(vendorStatusDto: SetVendorStatus): Promise<any> {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: vendorStatusDto.userId,
          status: In([
            VendorStatusEnum.ACTIVE,
            VendorStatusEnum.ADJUSTMENT,
            VendorStatusEnum.REJECTED,
          ]),
        },
      });
      if (!result) throw new NotFoundException(`isr Vendor not found`);

      switch (vendorStatusDto.status) {
        case VendorStatusEnum.REJECT:
          vendorStatusDto.status = VendorStatusEnum.REJECTED;
          break;
        case VendorStatusEnum.ADJUST:
          vendorStatusDto.status = VendorStatusEnum.ADJUSTMENT;
          break;
        default:
          throw new BadRequestException(`invalid status`);
      }
      const resul = await this.isrVendorsRepository.update(result.id, {
        status: vendorStatusDto.status,
        remark: vendorStatusDto.remark,
      });
      if (!resul) throw new BadRequestException(`Update Failed`);
      return { msg: 'Success' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async setIsrVendorStatus(userId: string): Promise<any> {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
        },
      });
      if (!result) throw new NotFoundException(`isr Vendor not found`);
      const initial = JSON.parse(JSON.stringify(result.initial));
      initial.status = 'Save as Draft';
      initial.level = 'level';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorByStatus(status: string): Promise<VendorsResponseDto[]> {
    try {
      const result = await this.vendorRepository.findBy({ status: status });
      if (!result) {
        throw new NotFoundException(
          `vendor with Status ${status} is not found`,
        );
      }
      return result.map((element) => VendorsResponseDto.fromEntity(element));
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  toInitialValue = async (result: VendorsEntity) => {
    const initialValues = initialValueSchema;

    initialValues.initial.status = result.status;
    initialValues.initial.level = result.level;
    initialValues.initial.userId = result.userId;
    initialValues.initial.id = result.id;

    initialValues.basic.origin = result.origin;
    initialValues.basic.country = result.country;
    initialValues.basic.district = result.district;
    initialValues.basic.tinNumber = result.tin;
    initialValues.basic.isrVendorId = result.isrVendorId;
    initialValues.basic.businessType = result.formOfEntity;
    initialValues.basic.name = result.name;

    initialValues.shareHolders = result.shareholders ? result.shareholders : [];
    initialValues.beneficialOwnership = result.beneficialOwnership;
    initialValues.beneficialOwnership = result.beneficialOwnership;
    const metadataw = JSON.parse(JSON.stringify(result.metaData));

    initialValues.address = metadataw?.address
      ? metadataw?.address
      : initialValues.address;
    initialValues.contactPersons = metadataw?.contactPersons
      ? metadataw?.contactPersons
      : [];
    initialValues.businessSizeAndOwnership = metadataw?.businessSizeAndOwnership
      ? metadataw?.businessSizeAndOwnership
      : initialValues.businessSizeAndOwnership;
    initialValues.areasOfBusinessInterest =
      metadataw?.areasOfBusinessInterest?.length > 0
        ? metadataw?.areasOfBusinessInterest
        : [];
    initialValues.supportingDocuments = metadataw.supportingDocuments;
    metadataw?.areasOfBusinessInterest?.length > 0
      ? metadataw?.areasOfBusinessInterest
      : [];
    initialValues.bankAccountDetails =
      result?.vendorAccounts?.length > 0
        ? this.toBankAccountDetails(result.vendorAccounts)
        : [];
    const invoice = await this.invoiceRepository.find({
      where: { payerAccountId: result.userId },
    });
    initialValues.invoice =
      invoice.length > 0 ? this.toInvoiveResponse(invoice) : [];
    return initialValues;
  };
  toInvoiveResponse(invoive: any[]) {
    return invoive.map((element) => {
      return {
        id: element.id,
        instanceId: element.instanceId,
        applicationNo: element.applicationNo,
        taskId: element.taskId,
        taskName: element.taskName,
        payToAccName: element.payToAccName,
        payToAccNo: element.payToAccNo,
        payToBank: element.payToBank,
        payerAccountId: element.payerAccountId,
        payerName: element.payerName,
        createdOn: element.createdOn,
        serviceName: element.serviceName,
        paymentStatus: element.paymentStatus,
        remark: element.remark,
        amount: element.amount,
      };
    });
  }
  toBankAccountDetails = (bankAccountDetails: any) => {
    return bankAccountDetails.map((element) => {
      return {
        id: element.vendorId,
        accountHolderFullName: element.accountHolderFullName,
        accountNumber: element.accountNumber,
        bankBranchAddress: element.branchAddress,
        currency: element.currency,
        bankSwift: element.bankSwift,
        IBAN: element.IBAN,
        status: element.status,
        bankId: element.bankId,
        hashValue: element.hashValue,
        branchName: element.branchName,
        isDefualt: element.isDefualt,
        accountType: element.accountType,
      };
    });
  };

  async deleteVendorById(vendorId: string): Promise<any> {
    try {
      const result = await this.vendorRepository.softDelete({
        id: vendorId,
      });
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
