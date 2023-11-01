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
import { DataSource, In, Repository } from 'typeorm';
import { VendorsEntity } from './entities/vendors.entity';
import { SetVendorStatus, VendorsResponseDto } from './dto/vendor.dto';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { BpServiceEntity } from 'src/services/entities/bp-service';
import { BusinessProcessEntity } from 'src/bpm/entities/business-process';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/handling/dtos/workflow-instance.dto';
import { FilesEntity } from './entities/file.entity';
import { FileResponseDto } from './dto/file.dto';
import { WorkflowInstanceService } from 'src/handling/services/workflow-instance.service';
import initialValueSchema2 from 'src/data2';
import { VendorInitiationDto } from './dto/vendor-initiation.dto';
import { BankAccountDetailEntity } from './entities/bank-account-detail.entity';
import { ServicePrice } from 'src/pricing/entities/service-price';
import { EntityCrudService } from 'src/shared/service';
import { AreasOfBusinessInterestEntity } from './entities/areas-of-business-interest.entity';
import {
  AreasOfBusinessInterestResponse,
  CreateAreasOfBusinessInterest,
} from './dto/areas-of-business-interest';
import { InvoiceEntity } from 'src/handling/entities/invoice.entity';
import { InvoiceResponseDto } from './dto/invoice.dto';

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,

    @Inject(WorkflowInstanceService)
    private readonly WorkflowInstanceService: WorkflowInstanceService,
    @InjectRepository(BpServiceEntity)
    private readonly bpServiceRepository: Repository<BpServiceEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(BusinessProcessEntity)
    private readonly businessProcessEntity: Repository<BusinessProcessEntity>,
    private readonly dataSource: DataSource, // private readonly workflowInstanceService: WorkflowInstanceService,
    @InjectRepository(ServicePrice)
    private readonly ServicePriceRepository: Repository<ServicePrice>,
    @InjectRepository(AreasOfBusinessInterestEntity)
    private readonly areasOfBusinessInterestRepository: Repository<AreasOfBusinessInterestEntity>,
  ) {
    super(vendorRepository);
  }
  async addVendorInformations(data: any): Promise<any> {
    this.vendorRepository.findOneOrFail({
      where: { userId: 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0' },
    });
    try {
      if (
        (data?.status == 'Save as Draft' ||
          data?.status == 'Save' ||
          data?.status == 'Submit') &&
        data?.userId !== undefined &&
        data?.status !== 'Submitted'
      ) {
        const result = await this.vendorRepository.save(
          await this.fromInitialValue(data),
        );

        if (data?.status == 'Submit') {
          const instances = [];
          for (let i = 0; i < data.areasOfBusinessInterest?.length; i++) {
            const workflowInstanceDto = new CreateWorkflowInstanceDto();
            workflowInstanceDto.key = 'newRegistration';
            workflowInstanceDto.status = 'Submit';
            workflowInstanceDto.requestorId = result.id;
            workflowInstanceDto.bpid = result.instances[i].bpId;
            workflowInstanceDto.pricingId =
              data.areasOfBusinessInterest[i]?.priceRange;

            const response =
              await this.WorkflowInstanceService.create(workflowInstanceDto);
            instances.push(response.application.id);
          }
          for (let i = 0; i < instances.length; i++) {
            const dto = new GotoNextStateDto();
            dto.instanceId = instances[i];
            dto.action = 'ISR';

            const res = await this.WorkflowInstanceService.gotoNextStep(dto);
          }
        }
        if (result) {
          return {
            message: 'Operation successful',
          };
        }
        return {
          message: 'Operation failed',
        };
      } else {
        throw new BadRequestException(
          'status can not be different from Save as Draft , Submitted , Save  and UserId can not be undefined ',
        );
      }
    } catch (error) {
      throw new BadRequestException('invalid application');
    }
  }
  async VendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
  ): Promise<any> {
    if (vendorInitiationDto.status === 'Save as Draft') {
      throw new BadRequestException(`invalid Status`);
    }
    try {
      const vendorsEntity = new VendorsEntity();
      vendorsEntity.id = vendorInitiationDto.id;
      vendorsEntity.userId = vendorInitiationDto.userId;
      vendorsEntity.status = vendorInitiationDto.status;
      vendorsEntity.name = vendorInitiationDto.name;
      vendorsEntity.formOfEntity = vendorInitiationDto.businessType;
      vendorsEntity.origin = vendorInitiationDto.origin;
      vendorsEntity.district = vendorInitiationDto?.district;
      vendorsEntity.country = vendorInitiationDto.country;
      vendorsEntity.origin = vendorInitiationDto.origin;
      vendorsEntity.tin = vendorInitiationDto.tinNumber;
      const result = await this.vendorRepository.save(vendorsEntity);
      if (result) {
        return { vendorId: result.id };
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getVendorInformation(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { userId: userId },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          instances: true,
          areasOfBusinessInterest: true,
        },
      });
      return vendorEntity;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getVendorByUserId(userId: string): Promise<typeof initialValueSchema2> {
    try {
      const vendorEntity = await this.vendorRepository.findOneOrFail({
        where: { userId: userId, status: In(['Save as Draft', 'Submitted']) },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          instances: true,
          areasOfBusinessInterest: true,
        },
      });
      return this.toInitialValue(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
  async getVendorByVendorId(vendorId: string): Promise<any> {
    try {
      const vendorStatus = await this.vendorRepository.findOne({
        where: { id: vendorId },
      });
      return vendorStatus ? vendorStatus : {};
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorId(vendorId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { userId: vendorId },
        relations: {
          shareholders: true,
          vendorAccounts: true,
          instances: true,
          beneficialOwnership: true,
          areasOfBusinessInterest: true,
        },
      });
      const invoice = await this.invoiceRepository.find({
        where: { payerAccountId: vendorId },
      });
      const vendorEntityRes = { ...vendorEntity, invoice: invoice };
      return this.toInitialValue(vendorEntityRes);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorAreaOfInterestByVendorId(userId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { userId: userId },
        relations: {
          areasOfBusinessInterest: true,
        },
      });
      return vendorEntity.areasOfBusinessInterest.map((element) =>
        AreasOfBusinessInterestResponse.fromEntity(element),
      );
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
  async setVendorStatus(vendorStatus: SetVendorStatus): Promise<any> {
    try {
      const result = await this.vendorRepository.findOne({
        where: { userId: vendorStatus.userId },
      });
      if (!result) {
        throw new NotFoundException(
          `user with Id ${vendorStatus.userId} does not have active vendor`,
        );
      }
      result.status = vendorStatus.status.toString();
      return VendorsResponseDto.fromEntity(
        await this.vendorRepository.save(result),
      );
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
  async getVendorApplicationInformation(): Promise<any> {
    try {
      const result = await this.vendorRepository.find({
        where: { status: 'Save as Draft' },
      });
      if (!result) {
        throw new NotFoundException(
          `There is no SUBMITTED  Vendor application found`,
        );
      }
      const data = [];

      result.map((element) => {
        data.push({
          id: element.id,
          userId: element.userId,
          status: element.status,
          name: element.name,
          updatedAt: element.updatedAt,
          tin: element.tin,
        });
      });
      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  fromInitialValue = async (data: any) => {
    let vendorsEntity: VendorsEntity = null;
    vendorsEntity = await this.vendorRepository.findOne({
      where: { userId: data.userId },
      relations: {
        shareholders: true,
        vendorAccounts: true,
        beneficialOwnership: true,
        instances: true,
        areasOfBusinessInterest: true,
      },
    });
    if (vendorsEntity.status == 'Submitted')
      throw new BadRequestException(
        `the application with id ${vendorsEntity.id} is already submitted`,
      );

    vendorsEntity.userId = data?.userId;
    vendorsEntity.level = data?.level;
    vendorsEntity.status =
      data?.status == 'Submit' ? 'Submitted' : data?.status;
    const basicRegistration = data.basic;
    vendorsEntity.tin = data?.tinNumber;
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.name = basicRegistration.name;
    vendorsEntity.district = basicRegistration.district;
    vendorsEntity.formOfEntity = basicRegistration.businessType;
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.origin = basicRegistration.origin;
    vendorsEntity.name = basicRegistration.name;

    const shareHolders = data.shareHolders;
    vendorsEntity.shareholders = shareHolders;

    const beneficialOwnership = data.beneficialOwnership;
    const bankAccountDetails = data.bankAccountDetails;
    vendorsEntity.beneficialOwnership = beneficialOwnership;
    vendorsEntity.areasOfBusinessInterest = data.areasOfBusinessInterest;
    const bankDetails =
      bankAccountDetails?.length > 0
        ? bankAccountDetails.map((element) => {
            return {
              id: element?.id,
              accountHolderFullName: element.accountHoldersFullName,
              accountNumber: element.accountNumber,
              IBAN: element.iBAN,
              bankSwift: element.bankSWIFT_BICCode,
              bankId: element.bankId,
              bankName: element.bankName,
              branchAddress: element.bankBranchAddress,
              branchName: element.branchName,
              currency: element.currency,
              hashValue: element.hashValue,
              status: element.status,
              vendorId: vendorsEntity.id,
            };
          })
        : [];
    vendorsEntity.vendorAccounts = bankDetails;
    const metadata = {
      address: data.address,
      supportingDocuments: data.supportingDocuments,
      areasOfBusinessInterest: data.areasOfBusinessInterest,
      businessSizeAndOwnership: data.businessSizeAndOwnership,
      contactPersons: data.contactPersons,
    };
    if (
      data?.level == 'ppda' &&
      data?.status == 'Save' &&
      data?.invoice?.length !== 0 &&
      data?.invoice !== undefined
    ) {
      try {
        const result = await this.invoiceRepository.insert(data?.invoice);
      } catch (error) {
        throw new BadRequestException(
          'inserting into invoiceRepository Failed',
        );
      }
    }
    vendorsEntity.metaData = JSON.parse(JSON.stringify(metadata));
    const workflowInstanceEntitys = [];
    for (let i = 0; i < data.areasOfBusinessInterest?.length; i++) {
      const workflowInstanceEntity = new WorkflowInstanceEntity();
      const response = await this.ServicePriceRepository.findOne({
        select: ['serviceId'],
        where: {
          id: data.areasOfBusinessInterest[i].priceId,
        },
      });

      const bp = await this.businessProcessEntity.findOne({
        select: ['id'],
        where: { serviceId: response.serviceId, isActive: true },
      });

      workflowInstanceEntity.applicationNumber =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      workflowInstanceEntity.status = 'Draft';
      workflowInstanceEntity.bpId = bp.id;
      workflowInstanceEntity.pricingId =
        data?.areasOfBusinessInterest[i].priceId;
      workflowInstanceEntitys.push(workflowInstanceEntity);
      vendorsEntity.instances = workflowInstanceEntitys;
    }

    return vendorsEntity;
  };
  toInitialValue = async (result: VendorsEntity) => {
    const initialValues = initialValueSchema2;

    initialValues.status = result.status;
    initialValues.level = result.level;
    initialValues.userId = result.userId;
    initialValues.id = result.id;
    initialValues.basic.origin = result.origin;
    initialValues.basic.country = result.country;
    initialValues.basic.district = result.district;
    initialValues.basic.tinNumber = result.tin;
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
        bankSWIFT_BICCode: element.bankSwift,
        iBAN: element.IBAN,
        status: element.status,
        bankId: element.bankId,
        hashValue: element.hashValue,
        branchName: element.branchName,
      };
    });
  };
  toBankAccountDetailsEntity = (
    bankAccountDetails: BankAccountDetailEntity[],
  ) => {
    return bankAccountDetails.map((element) => {
      return {
        accountHolderFullName: element.accountHolderFullName,
        accountNumber: element.accountNumber,
        branchAddress: element.branchAddress,
        currency: element.currency,
        bankSwift: element.bankSwift,
        IBAN: element.IBAN,
        status: element.status,
        bankId: element.bankId,
        hashValue: element.hashValue,
        branchName: element.branchName,
      };
    });
  };
  async deleteVendorById(vendorId: string): Promise<any> {
    try {
      const result = await this.vendorRepository.softDelete({
        id: vendorId,
      });
      console.log('result');
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
