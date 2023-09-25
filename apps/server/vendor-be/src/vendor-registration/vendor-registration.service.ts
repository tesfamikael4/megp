import { InjectRepository } from '@nestjs/typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CollectionQuery, QueryConstructor } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { ApplicationEntity } from './entities/application.entity';

import { ServicesEntity } from './entities/services.entity';
import { ServicesResponseDto } from './dto/services.dto';
import {
  ApplicationResponseDto,
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
import { VendorsEntity } from './entities/vendors.entity';
import { InsertAllDataDto } from './dto/save-all.dto';
import {
  CreateVendorsDto,
  SetVendorStatus,
  VendorsResponseDto,
} from './dto/vendor.dto';
import { CreateShareholdersDto } from './dto/shareholder.dto';
import { WorkflowInstanceEntity } from 'src/bpm/workflow-instances/entities/workflow-instance';
import { CreateWorkflowInstanceDto } from 'src/bpm/workflow-instances/dtos/workflow-instance.dto';
import { BpServiceEntity } from 'src/bpm/services/entities/bp-service';

@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
    @InjectRepository(ServicesEntity)
    private readonly serviceRepository: Repository<ServicesEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
    @InjectRepository(BpServiceEntity)
    private readonly bpServiceRepository: Repository<BpServiceEntity>,
  ) {}
  async create(setting: CreateApplicationDto): Promise<ApplicationResponseDto> {
    try {
      const registrationSettingEntity = CreateApplicationDto.fromDto(setting);
      await this.repository.save(registrationSettingEntity);

      return ApplicationResponseDto.fromEntity(registrationSettingEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    dto: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    try {
      dto.id = id;
      const regSettingEntity = UpdateApplicationDto.fromDto(dto);
      await this.repository.update({ id: dto.id }, regSettingEntity);
      return ApplicationResponseDto.fromEntity(regSettingEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  /*
fetch all applications of vendors
*/
  async findAll(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<ApplicationEntity>(
        this.repository,
        query,
      );
      const response = new DataResponseFormat<ApplicationResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result.map((entity) =>
          ApplicationResponseDto.fromEntity(entity),
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  /*
fetch  applications of vendor by Id
*/
  async findOne(id: string): Promise<ApplicationResponseDto> {
    try {
      const todoEntity = await this.repository.findOne({ where: { id } });
      return ApplicationResponseDto.fromEntity(todoEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async softDelete(id: string): Promise<boolean> {
    const response = await this.repository.softDelete(id);
    return response.affected > 0 ? true : false;
  }

  async restore(id: string): Promise<boolean> {
    const response = await this.repository.restore(id);
    if (response.affected > 0) return true;
    return false;
  }
  ////
  async findServices(query: CollectionQuery) {
    try {
      const dataQuery = QueryConstructor.constructQuery<ServicesEntity>(
        this.serviceRepository,
        query,
      );
      const response = new DataResponseFormat<ServicesResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = result.map((entity) =>
          ServicesResponseDto.fromEntity(entity),
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addVendorInformations(data: InsertAllDataDto): Promise<any> {
    const vender = await this.vendorRepository.find({
      where: { userId: data.data.userId, status: 'Save as Draft' },
      relations: [
        'shareholders',
        'vendorAccounts',
        'vendorAccounts.bank',
        'beneficialOwnership',
        'instances',
      ],
    });
    if (data?.data?.status == 'Save as Draft' || 'Save' || vender.length == 1) {
      const metadata = {
        addressInformation: data.data.data.addressInformation,
        supportingDocuments: data.data.data.supportingDocuments,
        areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
        businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
        contactPersons: data.data.data.contactPersons,
      };
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
      console.log('vendorsEntityvendorsEntity: ', vendorsEntity);

      // const workflowInstanceEntity = new WorkflowInstanceEntity();
      // const workflowInstanceEntitys = [];
      // const response = await this.bpServiceRepository.find({ where: { key: areasOfBusinessInterest.key, isActive: true } });
      // workflowInstanceEntity.applicationNumber = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // // workflowInstanceEntity.requestorId = result.id;
      // workflowInstanceEntity.status = 'Draft';
      // workflowInstanceEntity.bpId = response[0].id;
      // workflowInstanceEntitys.push(workflowInstanceEntity)
      // vendorsEntity.instances = workflowInstanceEntitys;

      console.log('vendorsEntityvendorsEntityvendorsEntity : ', vendorsEntity);
      const result = await this.vendorRepository.save(vendorsEntity);
      console.log(
        'after saved the vendor entity with workflow instance : ',
        vendorsEntity,
      );

      // Bank information Maping

      const initialValues = {
        id: '',
        status: '',
        userId: '',
        tin: '',
        basicRegistration: {
          nameOfBusinessCompany: '',
          formOfBusiness: '',
          businessCompanyOrigin: '',
          district: '',
          country: '',
        },
        addressInformation: {
          postalAddress: '',
          primaryEmail: '',
          alternateEmail: '',
          mobilePhone: '',
          telephone: '',
          fax: '',
          website: '',
          geoLocation: { xCoordinate: '', yCoordinate: '' },
        },
        contactPersons: {
          contactPersonsTable: 'contactPersonsTableExamples',
        },
        businessSizeAndOwnership: {
          registeredCapital: { amount: '', currency: '' },
          paidUpCapital: { amount: '', currency: '' },
          numberOfEmployees: '',
          ownershipType: '',
        },
        shareHolders: {
          shareHoldersTable: [
            {
              firstName: '',
              lastName: '',
              nationality: '',
              share: '',
              key: '',
            },
          ],
        },
        beneficialOwnership: {
          beneficialOwnershipTable: [
            { firstName: '', lastName: '', nationality: '' },
          ],
        },
        areasOfBusinessInterest: {
          areasOfBusinessInterestNames: [],
          areasOfBusinessInterestInformation: [],
        },
        bankAccountDetails: {
          bankAccountDetailsTable: [],
        },
        supportingDocuments: {
          businessRegistration_IncorporationCertificate: '',
          mRA_TPINCertificate: '',
          generalReceipt_BankDepositSlip: '',
          mRATaxClearanceCertificate: '',
          previousPPDARegistrationCertificate: '',
          mSMECertificate: '',
        },
      };

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
      initialValues.beneficialOwnership.beneficialOwnershipTable =
        result.beneficialOwnership;
      initialValues.beneficialOwnership.beneficialOwnershipTable =
        result.beneficialOwnership;

      const metadataw = JSON.parse(JSON.stringify(result.metaData));
      initialValues.addressInformation = metadataw.addressInformation;
      initialValues.contactPersons = metadataw.contactPersons;
      initialValues.businessSizeAndOwnership =
        metadataw.businessSizeAndOwnership;
      initialValues.areasOfBusinessInterest = metadataw.areasOfBusinessInterest;
      return initialValues;
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
}
