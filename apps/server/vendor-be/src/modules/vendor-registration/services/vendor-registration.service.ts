import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';
import { SetVendorStatus, VendorsResponseDto } from '../dto/vendor.dto';
import { FileResponseDto } from '../dto/file.dto';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import {
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

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,
    @Inject(WorkflowInstanceService)
    private readonly WorkflowInstanceService: WorkflowInstanceService,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly dataSource: DataSource, // private readonly workflowInstanceService: WorkflowInstanceService,
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
      try {
        const result = await this.isrVendorsRepository.save(
          await this.fromInitialValue(data),
        );
        const vendorId = result.id;
        if (
          data.initial.level == VendorStatusEnum.PPDA &&
          data.initial.status == VendorStatusEnum.SAVE
        ) {
          try {
            for (
              let index = 0;
              index < data.areasOfBusinessInterest.length;
              index++
            ) {
              const resul =
                await this.WorkflowInstanceService.generateVendorInvoice(
                  result.id,
                  data.areasOfBusinessInterest[index].priceRange,
                );
            }
          } catch (error) {
            throw new BadRequestException('invoice generation failed');
          }
          return { msg: 'Success' };
        }
        if (
          data.initial.status == VendorStatusEnum.SUBMIT &&
          data.initial.level == VendorStatusEnum.SUBMIT
        ) {
          const wfi = new CreateWorkflowInstanceDto();
          try {
            const instances = [];
            const response = [];
            const interests = data.areasOfBusinessInterest;
            for (let i = 0; i < interests.length; i++) {
              const bp = await this.bpService.findBpService(
                interests[i].priceRange,
              );
              if (!bp) {
                throw new NotFoundException('Business Process Not Found');
              }
              wfi.bpId = bp.id;
              wfi.serviceId = bp.serviceId;
              wfi.requestorId = result.id;
              const workflowInstance =
                await this.workflowInstanceService.create(wfi);

              instances.push(workflowInstance);
              response.push({
                applicationNumber:
                  workflowInstance.application.applicationNumber,
                instanceNumber: workflowInstance.application.id,
                vendorId: workflowInstance.application.requestorId,
              });
            }
            for (const instance of instances) {
              const dto = new GotoNextStateDto();
              dto.action = 'ISR';
              dto.instanceId = instance.application.id;
              const result = await this.workflowInstanceService.gotoNextStep(
                dto,
                userInfo,
              );
            }
            return response;
          } catch (error) {
            console.log(error);
            throw new BadRequestException(`workflow service failed`);
          }
        }
        return { msg: 'Success' };
      } catch (error) {
        throw new BadRequestException('invalid application');
      }
    }
  }
  fromInitialValue = async (data: any) => {
    let vendorsEntity: IsrVendorsEntity = null;
    vendorsEntity = await this.isrVendorsRepository.findOne({
      where: {
        userId: data.initial.userId,
        status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });
    if (!vendorsEntity) throw new NotFoundException('Vendor Not Found!!');
    const initial = JSON.parse(JSON.stringify(vendorsEntity.initial));

    if (initial.status == VendorStatusEnum.SUBMITTED)
      throw new BadRequestException(`already submitted`);
    const id = vendorsEntity.id;

    const newInitial: { level: string; userId: string; id: string } =
      data.initial;
    // vendorsEntity = { id, ...data.basic, ...newInitial };
    initial.status =
      data.initial.status == 'Submit' ? 'Save as Draft' : data.initial.status;
    vendorsEntity.initial = initial;
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
  async VendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
    userInfo: any,
  ): Promise<any> {
    if (vendorInitiationDto.status === VendorStatusEnum.SAVEASDRAFT) {
      throw new BadRequestException(`invalid status`);
    }
    try {
      const vendor = this.isrVendorsRepository.find({
        where: {
          userId: userInfo.id,
          status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
        },
      });
      if ((await vendor).length > 0)
        throw new BadRequestException(`there is active vendor already`);
      const vendorsEntity = new IsrVendorsEntity();
      vendorsEntity.userId = userInfo.id;
      vendorsEntity.status = VendorStatusEnum.ACTIVE;
      const initial = {
        userId: userInfo.id,
        status: vendorInitiationDto.status,
        level: vendorInitiationDto.level,
      };
      vendorsEntity.initial = JSON.parse(JSON.stringify(initial));
      vendorsEntity.basic = JSON.parse(JSON.stringify(vendorInitiationDto));

      const result = await this.isrVendorsRepository.save(vendorsEntity);
      if (result) {
        return { vendorId: result.id };
      }
    } catch (error) {
      throw new BadRequestException();
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

  async getIsrVendorByUserId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.isrVendorsRepository.findOne({
        where: {
          userId: userId,
          status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
        },
      });

      if (!vendorEntity) {
        throw new HttpException('vendor_not_found', HttpStatus.BAD_REQUEST);
      }
      const initial = JSON.parse(JSON.stringify(vendorEntity.initial));
      if (initial.status == 'Save as Draft' && initial.level == 'payment') {
        const areaOfBusinessInterest = JSON.parse(
          JSON.stringify(vendorEntity.areasOfBusinessInterest),
        );
        const invoice = await this.getInvoices(areaOfBusinessInterest, userId);
        return { ...vendorEntity, invoice: invoice };
      }
      return vendorEntity;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getInvoices(areaOfBusinessInterest: any[], userId: string) {
    const invoice = [];
    for (let index = 0; index < areaOfBusinessInterest.length; index++) {
      const element = await this.invoiceRepository.findOne({
        where: {
          payerAccountId: userId,
          // paymentStatus: In(['Pending']),
          pricingId: areaOfBusinessInterest[index].priceRange,
        },
      });
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
  async getVendors(): Promise<VendorsResponseDto[]> {
    try {
      const vendorEntity = await this.vendorRepository.find({
        relations: {
          shareholders: true,
          beneficialOwnership: true,
          instances: true,
          vendorAccounts: true,
          areasOfBusinessInterest: true,
        },
      });
      return vendorEntity.map((element) =>
        VendorsResponseDto.fromEntity(element),
      );
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

      if (vendorStatusDto.status == VendorStatusEnum.APPROVE) {
        if (result.status == VendorStatusEnum.APPROVE)
          throw new BadRequestException(`Already Approved`);
        const isrVendorData = result;
        const vendorEntity = new VendorsEntity();
        vendorEntity.status = VendorStatusEnum.APPROVED;
        vendorEntity.level = VendorStatusEnum.COMPLETED;
        const basic = JSON.parse(JSON.stringify(isrVendorData.basic));
        const initial = JSON.parse(JSON.stringify(isrVendorData.initial));
        vendorEntity.name = basic.name;
        vendorEntity.formOfEntity = basic.businessType;
        vendorEntity.origin = basic.origin;
        vendorEntity.district = basic.district;
        vendorEntity.country = basic.country;
        vendorEntity.tin = basic.tinNumber;
        vendorEntity.userId = initial.userId;
        vendorEntity.isrVendorId = initial.id;

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
        };
        // metadata.invoice = isrVendorData.invoice
        vendorEntity.metaData = tempMetadata;

        initial.status = VendorStatusEnum.APPROVED;
        initial.level = VendorStatusEnum.COMPLETED;
        await this.isrVendorsRepository.update(result.id, {
          status: VendorStatusEnum.APPROVED,
          remark: vendorStatusDto.remark,
          initial: initial,
        });
        const res = await this.vendorRepository.save(vendorEntity);
        if (!res) throw new BadRequestException(`vendor insertion failed`);
        return { msg: 'Success' };
      } else {
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
      }
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
