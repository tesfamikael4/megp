import { InjectRepository } from '@nestjs/typeorm';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { VendorsEntity } from './entities/vendors.entity';
import { InsertAllDataDto } from './dto/save-all.dto';
import { SetVendorStatus, VendorsResponseDto } from './dto/vendor.dto';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { BpServiceEntity } from 'src/services/entities/bp-service';
import { BusinessProcessEntity } from 'src/bpm/entities/business-process';
import initialValueSchema from 'src/data';
import { CreateWorkflowInstanceDto } from 'src/handling/dtos/workflow-instance.dto';
import { FilesEntity } from './entities/file.entity';
import { FileResponseDto, GetFileDto } from './dto/file.dto';
import { WorkflowInstanceService } from 'src/handling/services/workflow-instance.service';
import { CreateBankAccountDetailDto } from './dto/bank-account-detail.dto';
import { ServicePrice } from 'src/pricing/entities/service-price';

@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @Inject(WorkflowInstanceService)
    private readonly WorkflowInstanceService: WorkflowInstanceService,
    @InjectRepository(BpServiceEntity)
    private readonly bpServiceRepository: Repository<BpServiceEntity>,
    @InjectRepository(BusinessProcessEntity)
    private readonly businessProcessEntity: Repository<BusinessProcessEntity>,
    private readonly dataSource: DataSource, // private readonly workflowInstanceService: WorkflowInstanceService,
    @InjectRepository(ServicePrice)
    private readonly ServicePriceRepository: Repository<ServicePrice>,
  ) { }

  async addVendorInformations(data: InsertAllDataDto): Promise<any> {
    try {
      if (data?.data?.status == 'Save as Draft' || 'Save') {
        const result = await this.vendorRepository.save(
          await this.fromInitialValue(data),
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
            workflowInstanceDto.bpid = result.instances[i].bpId;
            workflowInstanceDto.pricingId =
              data.data.data.areasOfBusinessInterest
                ?.areasOfBusinessInterestInformation[i]?.priceRange;
            // workflowInstanceDto.data = result;
            console.log('workflowInstanceDto', workflowInstanceDto);
            await this.WorkflowInstanceService.create(workflowInstanceDto);
          }
        }
        // console.log('vendorsEntityvendorsEntityvendorsEntity', result)
        console.log('ooooooooooooooooooooooooo', this.toInitialValue(result));

        return this.toInitialValue(result);
      }
    } catch (error) { }
  }
  async getVendorInformation(vendorId: string): Promise<any> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { id: vendorId },
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
  async getVendorByUserId(userId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        select: ['id', 'createdAt', 'name', 'status', 'tin'],
        where: { userId: userId, status: In(['Save as Draft', 'Submitted']) },
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorStatusByVendorId(VendorId: string): Promise<string> {
    try {
      const vendorStatus = await this.vendorRepository.findOne({
        select: ['status'],
        where: { id: VendorId },
      });
      console.log('vendorStatusvendorStatus : ', vendorStatus);
      return vendorStatus.status;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorId(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOne({
        where: { id: vendorId },
        relations: {
          shareholders: true,
          vendorAccounts: { bank: true },
          beneficialOwnership: true,
          instances: true,
        },
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
          areasOfBusinessInterest: true,
        },
        where: {},
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
          };
        })
        : [];
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
          };
        })
        : [];
    return beneficialOwnershipData;
  };

  toInitialValue = (result: VendorsEntity) => {
    const initialValues = initialValueSchema;
    console.log('resultresultresult : ', result);
    initialValues.status = result.status;
    initialValues.userId = result.userId;
    initialValues.id = result.id;
    console.log('ffffffffffffffff : ');

    initialValues.basicRegistration.tinNumber = result.tin;
    initialValues.basicRegistration.businessCompanyOrigin = result.origin;
    initialValues.basicRegistration.country = result.country;
    initialValues.basicRegistration.district = result.district;
    initialValues.basicRegistration.tinNumber = result.tin;
    initialValues.basicRegistration.formOfBusiness = result.formOfEntity;
    initialValues.basicRegistration.nameOfBusinessCompany = result.name;
    let createBankAccountDetailDto: any = [new CreateBankAccountDetailDto()];
    console.log('gggggggggggggggggggg : ');

    createBankAccountDetailDto = result?.vendorAccounts?.map((element) => {
      return {
        id: element?.id,
        accountHoldersFullName: element.accountHolderFullName,
        accountNumber: element.accountNumber,
        vendorId: element.vendorId,
        bankId: element.bankId,
        branchName: element.branchName,
        bankBranchAddress: element.branchName,
        currency: element.currency,
        bankSWIFT_BICCode: element.bankSwift,
        iBAN: element.IBAN,
        status: element.status,
        hashValue: element.hashValue,
        bankName: element.bankName,
        metaData: element.metaData,
      };
    });
    console.log('ttttttttttttttttttttt', initialValues);

    initialValues.bankAccountDetails.bankAccountDetailsTable =
      createBankAccountDetailDto;

    initialValues.shareHolders.shareHoldersTable = result.shareholders
      ? result.shareholders
      : [];

    initialValues.beneficialOwnership.beneficialOwnershipTable =
      result.beneficialOwnership;
    initialValues.areasOfBusinessInterest.areasOfBusinessInterestNames =
      result.areasOfBusinessInterest?.map((element) => element.category);

    initialValues.areasOfBusinessInterest.areasOfBusinessInterestInformation =
      this.areaOfBusinessInterest(result.areasOfBusinessInterest);
    console.log('ggggggggggggggggggggg', initialValues);
    const metadataw = JSON.parse(JSON.stringify(result.metaData));

    initialValues.addressInformation = metadataw.addressInformation;
    initialValues.contactPersons = metadataw.contactPersons;
    initialValues.businessSizeAndOwnership = metadataw.businessSizeAndOwnership;
    initialValues.bankAccountDetails = metadataw.bankAccountDetails;
    console.log('ppppppppppppppppppppppppppppppp', initialValues);
    return initialValues;
  };

  fromInitialValue = async (data: InsertAllDataDto) => {
    let vendorsEntity: VendorsEntity = null;
    if (data.data.id && data.data.id !== '') {
      console.log('ddddddddddd', data.data.id);
      vendorsEntity = await this.vendorRepository.findOne({
        where: { id: data.data.id },
        relations: {
          shareholders: true,
          vendorAccounts: true,
          beneficialOwnership: true,
          instances: true,
          areasOfBusinessInterest: true,
        },
      });
    } else {
      vendorsEntity = new VendorsEntity();
    }
    vendorsEntity.userId = data?.data?.userId;
    vendorsEntity.status =
      data?.data?.status == 'Save' ? 'Submitted' : data?.data?.status;
    const basicRegistration = data.data.data.basicRegistration;

    vendorsEntity.tin = basicRegistration.tinNumber;
    //basicRegistration Information
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.name = basicRegistration.name;
    vendorsEntity.district = basicRegistration.district;
    vendorsEntity.formOfEntity = basicRegistration.formOfBusiness;
    vendorsEntity.country = basicRegistration.country;
    vendorsEntity.origin = basicRegistration.businessCompanyOrigin;
    vendorsEntity.name = basicRegistration.nameOfBusinessCompany;

    //shareHolders Information
    const shareHolders = data.data.data.shareHolders.shareHoldersTable;
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
        : [];
    vendorsEntity.shareholders = shareHoldersEntity;

    // mapping the payload Beneficiary Ownership info
    const beneficialOwnership =
      data.data.data.beneficialOwnership.beneficialOwnershipTable;
    const bankAccountDetails =
      data.data.data.bankAccountDetails.bankAccountDetailsTable;

    let beneficialOwnershipEntity = [];
    beneficialOwnershipEntity =
      this.beneficialOwnershipmapper(beneficialOwnership);
    vendorsEntity.beneficialOwnership = beneficialOwnershipEntity;
    // vendorsEntity.instances = workflowInstanceEntitys;
    const areasOfBusinessInterest = data.data.data.areasOfBusinessInterest;

    vendorsEntity.areasOfBusinessInterest = this.areaOfBusinessInterest(
      areasOfBusinessInterest?.areasOfBusinessInterestInformation,
    );

    const bankDetails =
      bankAccountDetails.length > 0
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
            vendorId: '0c8b5d84-aad1-3d59-a8d8-841103a4ec4e',
          };
        })
        : [];
    // vendorsEntity.vendorAccounts = bankDetails;
    const metadata = {
      addressInformation: data.data.data.addressInformation,
      supportingDocuments: data.data.data.supportingDocuments,
      areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
      businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
      contactPersons: data.data.data.contactPersons,
      bankAccountDetails: data.data.data.bankAccountDetails,
    };
    vendorsEntity.metaData = JSON.parse(JSON.stringify(metadata));

    const workflowInstanceEntitys = [];
    for (
      let i = 0;
      i < areasOfBusinessInterest?.areasOfBusinessInterestInformation?.length;
      i++
    ) {
      const workflowInstanceEntity = new WorkflowInstanceEntity();
      const response = await this.ServicePriceRepository.findOne({
        select: ['serviceId'],
        where: {
          id: areasOfBusinessInterest?.areasOfBusinessInterestInformation[i]
            .priceRange,
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
        areasOfBusinessInterest?.areasOfBusinessInterestInformation[i]
          .priceRange;
      // workflowInstanceEntity.requestorId = result.id;
      workflowInstanceEntitys.push(workflowInstanceEntity);

      vendorsEntity.instances = workflowInstanceEntitys;
    }
    console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', vendorsEntity);
    return vendorsEntity;
  };
}
