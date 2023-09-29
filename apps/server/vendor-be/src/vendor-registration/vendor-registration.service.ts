import { InjectRepository } from '@nestjs/typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { VendorsEntity } from './entities/vendors.entity';
import { InsertAllDataDto } from './dto/save-all.dto';
import { SetVendorStatus, VendorsResponseDto } from './dto/vendor.dto';
import { WorkflowInstanceEntity } from 'src/bpm/workflow-instances/entities/workflow-instance';
import { BpServiceEntity } from 'src/bpm/services/entities/bp-service';
import { BusinessProcessEntity } from 'src/bpm/business-process/entities/business-process';
import initialValueSchema from 'src/data';
//import { WorkflowInstanceService } from 'src/bpm/workflow-instances/workflow-instance.service';
import { CreateWorkflowInstanceDto } from 'src/bpm/workflow-instances/dtos/workflow-instance.dto';
@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(BpServiceEntity)
    private readonly bpServiceRepository: Repository<BpServiceEntity>,
    @InjectRepository(BusinessProcessEntity)
    private readonly businessProcessEntity: Repository<BusinessProcessEntity>, // private readonly workflowInstanceService: WorkflowInstanceService,
  ) {}

  async addVendorInformations(data: InsertAllDataDto): Promise<any> {
    const vender = await this.vendorRepository.find({
      where: { userId: data.data.userId, status: 'Save as Draft' },
      relations: [
        'shareholders',
        'vendorAccounts',
        'vendorAccounts.bank',
        'beneficialOwnership',
        'instances',
        'areasOfBusinessInterest',
      ],
    });
    if (data?.data?.status == 'Save as Draft' || 'Save' || vender.length <= 1) {
      // const areasOfBusinessInterestEntity = areasOfBusinessInterest?.areasOfBusinessInterestInformation?.map((element) => CreateAreasOfBusinessInterest.fromDto(element))
      // vendorsEntity.areasOfBusinessInterest = areasOfBusinessInterestEntity

      const result = await this.vendorRepository.save(
        await this.fromInitialValue(data, vender),
      );
      if (data?.data?.status == 'Save') {
        for (
          let i = 0;
          i <
          data.data.data.areasOfBusinessInterest
            ?.areasOfBusinessInterestInformation.length;
          i++
        ) {
          const workflowInstanceDto = new CreateWorkflowInstanceDto();
          workflowInstanceDto.key =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          workflowInstanceDto.status = 'Submit';
          workflowInstanceDto.requestorId = result.id;
          workflowInstanceDto.pricingId =
            data.data.data.areasOfBusinessInterest
              ?.areasOfBusinessInterestInformation[i]?.pricingId;
          workflowInstanceDto.data = result;
          //  const res =
          // await this.workflowInstanceService.create(workflowInstanceDto);
          //console.log(res);
        }
      }

      return this.toInitialValue(result);
    }
  }
  async getVendorId(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { id: vendorId },
        relations: [
          'shareholders',
          'vendorAccounts',
          'vendorAccounts.bank',
          'beneficialOwnership',
          'instances',
        ],
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorByUserId(userId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneOrFail({
        where: { userId: userId },
        relations: [
          'shareholders',
          'vendorAccounts',
          'vendorAccounts.bank',
          'beneficialOwnership',
          'instances',
          'areasOfBusinessInterest',
        ],
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorById(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneOrFail({
        where: { id: vendorId },
        relations: [
          'shareholders',
          'vendorAccounts',
          'vendorAccounts.bank',
          'beneficialOwnership',
          'instances',
          'areasOfBusinessInterest',
          'customCats',
          'businessCats',
        ],
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getVendors(): Promise<VendorsResponseDto[]> {
    try {
      const vendorEntity = await this.vendorRepository.find({
        relations: [
          'shareholders',
          'shareholders',
          'beneficialOwnership',
          'instances',
          'areasOfBusinessInterest',
        ],
      });
      return vendorEntity.map((element) =>
        VendorsResponseDto.fromEntity(element),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async setVendorStatus(
    vendorStatus: SetVendorStatus,
  ): Promise<VendorsResponseDto> {
    try {
      const result = await this.vendorRepository.findOneBy({
        id: vendorStatus.vendorId,
      });
      if (!result) {
        throw new NotFoundException(
          `vendor with Id ${vendorStatus.vendorId} is not found`,
        );
      }
      result.status = vendorStatus.status.toString();
      const vendorEntity = await this.vendorRepository.save(result);
      return VendorsResponseDto.fromEntity(vendorEntity);
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
  beneficialOwnershipmapper = (beneficialOwnership: any) => {
    const beneficialOwnershipData =
      beneficialOwnership?.length > 0
        ? beneficialOwnership?.map((element) => {
            return {
              id: element?.id,
              firstName: element.firstName,
              lastName: element.lastName,
              nationality: element.nationality,
              vendorId: element.vendorId,
            };
          })
        : undefined;
    return beneficialOwnershipData;
  };
  areaOfBusinessInterest = (areaOfBusinessInterest: any) => {
    const beneficialOwnershipData =
      areaOfBusinessInterest?.length > 0
        ? areaOfBusinessInterest?.map((element) => {
            return {
              id: element?.id,
              category: element.category,
              lineOfBusiness: element.lineOfBusiness,
              priceRange: element.priceRange,
              vendorId: element?.vendorId,
            };
          })
        : undefined;
    return beneficialOwnershipData;
  };

  toInitialValue = (result: VendorsEntity) => {
    const initialValues = initialValueSchema;
    initialValues.status = result.status;
    initialValues.userId = result.userId;
    initialValues.id = result.id;
    initialValues.tin = result.tin;
    initialValues.basicRegistration.businessCompanyOrigin = result.origin;
    initialValues.basicRegistration.country = result.country;
    initialValues.basicRegistration.district = result.district;
    initialValues.basicRegistration.formOfBusiness = result.formOfEntity;
    initialValues.basicRegistration.nameOfBusinessCompany = result.name;
    initialValues.bankAccountDetails.bankAccountDetailsTable =
      result.vendorAccounts;
    initialValues.shareHolders.shareHoldersTable = result.shareholders
      ? result.shareholders
      : [];
    initialValues.instance = result.instances ? result.instances : [];
    initialValues.beneficialOwnership.beneficialOwnershipTable =
      result.beneficialOwnership;
    initialValues.beneficialOwnership.beneficialOwnershipTable =
      result.beneficialOwnership;
    initialValues.areasOfBusinessInterest.areasOfBusinessInterestNames =
      result.areasOfBusinessInterest?.map((element) => element.category);
    initialValues.areasOfBusinessInterest.areasOfBusinessInterestInformation =
      this.areaOfBusinessInterest(result.areasOfBusinessInterest);

    const metadataw = JSON.parse(JSON.stringify(result.metaData));
    initialValues.addressInformation = metadataw.addressInformation;
    initialValues.contactPersons = metadataw.contactPersons;
    initialValues.businessSizeAndOwnership = metadataw.businessSizeAndOwnership;

    return initialValues;
  };
  fromInitialValue = async (
    data: InsertAllDataDto,
    vender: VendorsEntity[],
  ) => {
    const beneficialOwnership =
      data.data.data.beneficialOwnership.beneficialOwnershipTable;
    const basicRegistration = data.data.data.basicRegistration;
    const shareHolders = data.data.data.shareHolders.shareHoldersTable;
    const bankAccountDetails =
      data.data.data.bankAccountDetails.bankAccountDetailsTable;
    const areasOfBusinessInterest = data.data.data.areasOfBusinessInterest;
    const vendorsEntity = vender.length > 0 ? vender[0] : new VendorsEntity();
    // vendorsEntity.id = vender.length > 0 ? vender[0]?.id : undefined
    vendorsEntity.userId = data?.data?.userId;
    vendorsEntity.tin = data?.data?.tin;
    vendorsEntity.status =
      data?.data?.status == 'Save' ? 'Submitted' : data?.data?.status;

    const metadata = {
      addressInformation: data.data.data.addressInformation,
      supportingDocuments: data.data.data.supportingDocuments,
      areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
      businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
      contactPersons: data.data.data.contactPersons,
    };
    vendorsEntity.metaData = JSON.parse(JSON.stringify(metadata));
    //basicRegistration Information
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.name = basicRegistration.name;
    vendorsEntity.district = basicRegistration.district;
    vendorsEntity.formOfEntity = basicRegistration.formOfBusiness;
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.origin = basicRegistration.businessCompanyOrigin;
    vendorsEntity.name = basicRegistration.nameOfBusinessCompany;
    //shareHolders Information
    let shareHoldersEntity = [];
    shareHoldersEntity =
      shareHolders.length > 0
        ? shareHolders?.map((element) => {
            return {
              id: element?.id, // this id will make the operation update if its drafted already
              firstName: element.firstName,
              lastName: element.lastName,
              nationality: element.share,
              share: element.share,
              key: element.key,
            };
          })
        : undefined;
    vendorsEntity.shareholders = shareHoldersEntity;
    const bankDetails =
      bankAccountDetails.length > 0
        ? bankAccountDetails.map((element) => {
            return {
              id: element?.id,
              AccountHolderFullName: element.accountHoldersFullName,
              AccountNumber: element.accountNumber,
              IBAN: element.iBAN,
              bankSwift: element.bankSWIFT_BICCode,
              bankId: element.bankId,
              bankName: element.bankName,
              branchAddress: element.bankBranchAddress,
              branchName: element.branchName,
              currency: element.currency,
              hashValue: element.hashValue,
              status: element.status,
            };
          })
        : undefined;
    vendorsEntity.vendorAccounts = bankDetails;
    // mapping the payload Beneficiary Ownership info
    let beneficialOwnershipEntity = [];
    beneficialOwnershipEntity =
      this.beneficialOwnershipmapper(beneficialOwnership);
    vendorsEntity.beneficialOwnership = beneficialOwnershipEntity;

    const workflowInstanceEntity = new WorkflowInstanceEntity();
    const workflowInstanceEntitys = [];

    const response = await this.bpServiceRepository.find({
      where: { key: areasOfBusinessInterest.key, isActive: true },
    });
    const bp = await this.businessProcessEntity.findOneOrFail({
      where: { serviceId: response[0].id, isActive: true },
    });
    workflowInstanceEntity.applicationNumber =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    // workflowInstanceEntity.requestorId = result.id;
    workflowInstanceEntity.status = 'Draft';
    workflowInstanceEntity.bpId = bp.id;
    workflowInstanceEntitys.push({
      status: 'Draft',
      bpId: bp.id,
      applicationNumber: Date.now() + '-' + Math.round(Math.random() * 1e9),
    });
    vendorsEntity.instances = workflowInstanceEntitys;
    vendorsEntity.areasOfBusinessInterest = this.areaOfBusinessInterest(
      areasOfBusinessInterest?.areasOfBusinessInterestInformation,
    );

    return vendorsEntity;
  };
}
