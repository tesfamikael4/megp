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
import { Any, DataSource, In, Repository, Transaction } from 'typeorm';
import { SetVendorStatus, VendorsResponseDto } from '../dto/vendor.dto';
import { FileResponseDto } from '../dto/file.dto';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import { EntityCrudService } from 'src/shared/service';
import { VendorStatusEnum } from 'src/shared/enumes/vendor-status-enums';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';
import {
  AreasOfBusinessInterestEntity,
  FilesEntity,
  InvoiceEntity,
  VendorsEntity,
} from 'src/entities';
import { WorkflowInstanceService } from 'src/modules/handling/services/workflow-instance.service';
import initialValueSchema from '../dto/add-vendor.dto';

@Injectable()
export class VendorRegistrationsService extends EntityCrudService<VendorsEntity> {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,

    @Inject(WorkflowInstanceService)
    private readonly WorkflowInstanceService: WorkflowInstanceService,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly dataSource: DataSource, // private readonly workflowInstanceService: WorkflowInstanceService,
    @InjectRepository(AreasOfBusinessInterestEntity)
    private readonly areasOfBusinessInterestRepository: Repository<AreasOfBusinessInterestEntity>,
  ) {
    super(vendorRepository);
  }
  async addVendorInformations(data: any): Promise<any> {
    if (
      data.initial.status == VendorStatusEnum.SAVEASDRAFT ||
      data.initial.status == VendorStatusEnum.SAVE ||
      data.initial.status == VendorStatusEnum.SUBMIT
    ) {
      try {
        const result = await this.vendorRepository.save(
          await this.fromInitialValue(data),
        );
        if (data.initial.level == 'ppda' && data.initial.status == 'Save') {
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
            return 'Saved';
          } catch (error) {
            throw new BadRequestException('invoice generation failed');
          }
        }

        return result;
      } catch (error) {
        throw new BadRequestException('invalid application');
      }
    }
  }
  fromInitialValue = async (data: any) => {
    let vendorsEntity: VendorsEntity = null;
    vendorsEntity = await this.vendorRepository.findOne({
      where: { userId: data.initial.userId },
      relations: {
        shareholders: true,
        vendorAccounts: true,
        beneficialOwnership: true,
        instances: true,
        areasOfBusinessInterest: true,
      },
    });
    if (!vendorsEntity) throw new NotFoundException('Vendor Not Found!!');
    if (vendorsEntity.status == VendorStatusEnum.SUBMITTED)
      throw new BadRequestException(`already submitted`);
    const id = vendorsEntity.id;
    const newInitial: { level: string; userId: string } = data.initial;
    vendorsEntity = { id, ...data.basic, ...newInitial };
    vendorsEntity.status =
      data.initial.status == 'Submit' ? 'Save as Draft' : data.initial.status;

    vendorsEntity.shareholders = data.shareHolders;
    vendorsEntity.beneficialOwnership = data.beneficialOwnership;
    vendorsEntity.areasOfBusinessInterest = data.areasOfBusinessInterest;
    vendorsEntity.vendorAccounts = data.bankAccountDetails?.map((item) => ({
      ...item,
      vendorId: vendorsEntity.id,
    }));
    const metadata = {
      address: data.address,
      supportingDocuments: data.supportingDocuments,
      areasOfBusinessInterest: data.areasOfBusinessInterest,
      businessSizeAndOwnership: data.businessSizeAndOwnership,
      contactPersons: data.contactPersons,
    };
    vendorsEntity.metaData = JSON.parse(JSON.stringify(metadata));
    return vendorsEntity;
  };
  async addVendorInformationsWithTransaction(data: any): Promise<any> {
    const queryRunner =
      this.areasOfBusinessInterestRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const areasOfBusinessInterestEntity = new AreasOfBusinessInterestEntity();
      areasOfBusinessInterestEntity.category = 'category';
      areasOfBusinessInterestEntity.lineOfBusiness = ['lineOfBusiness'];
      areasOfBusinessInterestEntity.priceRange = 'priceRange';
      areasOfBusinessInterestEntity.vendorId = 'vendorId';
      await queryRunner.manager
        .getRepository(AreasOfBusinessInterestEntity)
        .save(areasOfBusinessInterestEntity);

      const entity2Data = {
        /* data for Entity2 */
      };
      // await queryRunner.manager.getRepository(YourEntity2).save(entity2Data);
    } catch (error) {}
  }
  async VendorInitiation(
    vendorInitiationDto: VendorInitiationDto,
  ): Promise<any> {
    if (vendorInitiationDto.status === VendorStatusEnum.SAVEASDRAFT) {
      throw new BadRequestException(`invalid status`);
    }
    try {
      const vendorsEntity = new VendorsEntity();
      vendorsEntity.userId = vendorInitiationDto.userId;
      vendorsEntity.level = vendorInitiationDto.level;
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
      // return error;
      throw new BadRequestException();
    }
  }

  async getVendorByUserId(userId: string): Promise<typeof initialValueSchema> {
    try {
      const vendorEntity = await this.vendorRepository.findOneOrFail({
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
        where: { payerAccountId: vendorEntity.id },
      });
      const vendorEntityRes = { ...vendorEntity, invoice: invoice };
      return this.toInitialValue(vendorEntityRes);
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
