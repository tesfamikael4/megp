import { InjectRepository } from '@nestjs/typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CreateVendorsDto, VendorsResponseDto } from './dto/vendor.dto';
import { CreateShareholdersDto } from './dto/shareholder.dto';
import { FilesEntity } from './entities/file.entity';
import { CreateFileDto, GetFileDto } from './dto/file.dto';

@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
    @InjectRepository(ServicesEntity)
    private readonly serviceRepository: Repository<ServicesEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
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
  async registerVendor(data: InsertAllDataDto): Promise<any> {
    const vender = await this.vendorRepository.find({
      where: { userId: data.data.userId },
      relations: ['shareholders'],
    });
    console.log(vender);
    if (!vender) {
      try {
        // const stringifiedData = JSON.stringify(data);
        // const ObjectData = JSON.parse(stringifiedData);
        // console.log('datadatadatadatadatadatadata ', ObjectData)
        const metadata = {
          addressInformation: data.data.data.addressInformation,
          contactPersons: data.data.data.contactPersons,
          businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
          beneficialOwnership: data.data.data.beneficialOwnership,
          areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
        };
        // console.log('mmmmmeeeetttaaaadddaaattttaaa : ', metadata);
        const basicRegistration = data.data.data.basicRegistration;
        const vendor = new CreateVendorsDto();
        // this Id will help us to make an update or insertion if the information is saved on the
        //collapse it must have an Id
        const vender = await this.vendorRepository.find(data?.data?.userId);
        console.log(vender);
        if (vender) {
          vendor.id = vender[0]?.id;
        }
        vendor.name = basicRegistration?.nameOfBusinessCompany;
        vendor.formOfEntity = basicRegistration?.formOfBusiness;
        vendor.origin = basicRegistration?.businessCompanyOrigin;
        vendor.district = basicRegistration?.district;
        vendor.country = basicRegistration?.country;
        vendor.tin = basicRegistration?.tin;
        vendor.status = data?.data?.status;
        vendor.userId = data?.data?.userId;
        vendor.metaData = JSON.parse(JSON.stringify(metadata));

        const vendorEntity = CreateVendorsDto.fromDto(vendor);
        const result = await this.vendorRepository.save(vendorEntity);
        if (data.data.data?.shareHolders?.shareHoldersTable) {
          const shareHolders = data.data?.data.shareHolders?.shareHoldersTable;
          let shareholdersarray = [];
          shareholdersarray = shareHolders.map((elemet) => {
            return {
              // this id will make the operation update if its drafted already
              id: elemet?.id,
              fullName: elemet?.fullName,
              Nationality: elemet?.nationality,
              Share: elemet?.share,
            };
          });
          const shareholderarrays =
            CreateShareholdersDto.fromDtos(shareholdersarray);
          // console.log('arrraay : ', shareholderarrays[0]);
          result.shareholders = shareholderarrays;
          const result2 = await this.vendorRepository.save(result);
          return result2;
        }
        return result;
        return result;
      } catch (error) {
        console.log('error : ', error);
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // const stringifiedData = JSON.stringify(data);
        // const ObjectData = JSON.parse(stringifiedData);
        // console.log('datadatadatadatadatadatadata ', ObjectData)
        const metadata = {
          addressInformation: data.data.data.addressInformation,
          contactPersons: data.data.data.contactPersons,
          businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
          beneficialOwnership: data.data.data.beneficialOwnership,
          areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
        };
        // console.log('mmmmmeeeetttaaaadddaaattttaaa : ', metadata);
        const basicRegistration = data.data.data.basicRegistration;
        const vendor = new CreateVendorsDto();
        // this Id will help us to make an update or insertion if the information is saved on the
        //collapse it must have an Id
        const vender = await this.vendorRepository.find(data?.data?.userId);
        console.log(vender);
        if (vender) {
          vendor.id = vender[0]?.id;
        }
        vendor.name = basicRegistration?.nameOfBusinessCompany;
        vendor.formOfEntity = basicRegistration?.formOfBusiness;
        vendor.origin = basicRegistration?.businessCompanyOrigin;
        vendor.district = basicRegistration?.district;
        vendor.country = basicRegistration?.country;
        // Nullable
        vendor.tin = basicRegistration?.tin;
        vendor.status = data?.data?.status;
        vendor.userId = data?.data?.userId;
        vendor.metaData = JSON.parse(JSON.stringify(metadata));

        const vendorEntity = CreateVendorsDto.fromDto(vendor);
        // if (data.data.data.bankAccountDetails.bankAccountDetailsTable) {
        //   console.log('wwwwwwwwwwwwwwwwwwwwww')
        //   const bankDetailInfo = data.data.data.bankAccountDetails.bankAccountDetailsTable
        //   console.log('bankDetailInfobankDetailInfobankDetailInfo : ', bankDetailInfo)
        //   const bankDetails = bankDetailInfo.map((element) => {
        //     return {
        //       AccountHolderFullName: element.AccountHolderFullName,
        //       AccountNumber: element.AccountNumber,
        //       IBAN: element.IBAN,
        //       bank: element.bank,
        //       bankSwift: element.bankSwift,
        //       branchAddress: element.branchAddress,
        //       branchName: element.branchName,
        //       currency: element.currency,
        //       hashValue: element.hashValue,
        //       id: element?.id,
        //       status: element.status
        //     }
        //   })
        //   console.log('tttttthhhhhhhddddaaaaaaattttaaaaaaaaiiiiisssss: ', bankDetails)
        //   vendorEntity.vendorAccounts = VendorsBankDto.fromDtos(bankDetails)
        //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: ', bankDetails)

        // }
        const result = await this.vendorRepository.save(vendorEntity);
        // going to save shareholders
        console.log('cccccccccccccccccccccccc : ', data.data.data);
        if (data.data.data?.shareHolders?.shareHoldersTable) {
          const shareHolders = data.data?.data.shareHolders?.shareHoldersTable;
          console.log(
            'cccccccccccccccccccccccc : ',
            data.data.data?.shareHolders?.shareHoldersTable,
          );
          let shareholdersarray = [];
          shareholdersarray = shareHolders.map((elemet) => {
            return {
              // this id will make the operation update if its drafted already
              id: elemet?.id,
              fullName: elemet?.fullName,
              Nationality: elemet?.nationality,
              Share: elemet?.share,
            };
          });
          const shareholderarrays =
            CreateShareholdersDto.fromDtos(shareholdersarray);
          // console.log('arrraay : ', shareholderarrays[0]);
          result.shareholders = shareholderarrays;
          // console.log('resultresultresultresultresultresult : ', result);
          const result2 = await this.vendorRepository.save(result);
          return result2;
        }
        return result;
      } catch (error) {
        console.log('error : ', error);
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
    //end of data
    // console.log('datadatadatadatadatadatadata ', data)
  }
  async addVendorInformations(data: InsertAllDataDto): Promise<any> {
    const vender = await this.vendorRepository.find({
      where: { userId: data.data.userId, status: 'Save as Draft' },
      relations: ['shareholders', 'vendorAccounts', 'vendorAccounts.bank'],
    });
    // console.log('vender ', vender)
    if (data?.data?.status == 'Save as Draft') {
      // console.log('vendervendervender : ', vender)
      const metadata = {
        addressInformation: data.data.data.addressInformation,
        contactPersons: data.data.data.contactPersons,
        beneficialOwnership: data.data.data.beneficialOwnership,
        areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
        // bankAccountDetails: data.data.data.bankAccountDetails,
        businessSizeAndOwnership: data.data.data.businessSizeAndOwnership,
      };
      const businessSizeAndOwnership = data.data.data.businessSizeAndOwnership;
      const basicRegistration = data.data.data.basicRegistration;
      const shareHolders = data.data.data.shareHolders.shareHoldersTable;
      const bankAccountDetails =
        data.data.data.bankAccountDetails.bankAccountDetailsTable;
      const supportingDocuments = data.data.data.supportingDocuments;

      // console.log('bankAccountDetailsbankAccountDetailsbankAccountDetailsbankAc: ', bankAccountDetails)
      const vendorsEntity = vender.length > 0 ? vender[0] : new VendorsEntity();
      // vendorsEntity.id = vender.length > 0 ? vender[0]?.id : undefined
      vendorsEntity.userId = data?.data?.userId;
      vendorsEntity.status = data?.data?.status;
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
          ? shareHolders?.map((elemet) => {
              return {
                id: elemet?.id, // this id will make the operation update if its drafted already
                share: elemet?.share,
                fullName: elemet?.fullName,
                Nationality: elemet?.nationality,
              };
            })
          : undefined;
      vendorsEntity.shareholders = shareHoldersEntity;

      // console.log('dddddddddddddddddddddd : ', vendorsEntity.vendorAccounts)
      const bankDetails =
        bankAccountDetails.length > 0
          ? bankAccountDetails.map((element) => {
              // console.log('elementelementelementelement : ', element)
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

      const result = await this.vendorRepository.save(vendorsEntity);
      // Bank information Maping
      const initialValues = {
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
          shareHoldersTable: [{ fullName: '', nationality: '', share: '' }],
        },
        beneficialOwnership: {
          shareHoldersTable: [{ fullName: '', nationality: '' }],
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
      const metadataw = JSON.parse(JSON.stringify(result.metaData));
      console.log(
        'metadatawmetadatawmetadatawmetadatawmetadataw : ',
        metadataw,
      );
      initialValues.basicRegistration.businessCompanyOrigin = result.origin;
      initialValues.basicRegistration.country = result.country;
      initialValues.basicRegistration.district = result.district;
      initialValues.basicRegistration.formOfBusiness = result.formOfEntity;
      initialValues.basicRegistration.nameOfBusinessCompany = result.name;
      initialValues.bankAccountDetails.bankAccountDetailsTable =
        result.vendorAccounts;
      initialValues.shareHolders.shareHoldersTable = result.shareholders;

      initialValues.addressInformation = metadataw.addressInformation;
      initialValues.contactPersons.contactPersonsTable =
        metadataw.contactPersons;
      initialValues.beneficialOwnership.shareHoldersTable =
        metadataw.beneficialOwnership;
      initialValues.businessSizeAndOwnership =
        metadataw.businessSizeAndOwnership;
      initialValues.areasOfBusinessInterest.areasOfBusinessInterestInformation =
        metadataw.areasOfBusinessInterest;
      // bankAccountDetails: data.data.data.bankAccountDetails,
      console.log('initialValues : ', initialValues);
      return initialValues;
    }
  }
  async getVendorId(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneBy({
        id: vendorId,
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorByUserId(userId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneBy({
        userId: userId,
      });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendors(): Promise<VendorsResponseDto[]> {
    try {
      const vendorEntity = await this.vendorRepository.find();
      return vendorEntity.map((element) =>
        VendorsResponseDto.fromEntity(element),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
