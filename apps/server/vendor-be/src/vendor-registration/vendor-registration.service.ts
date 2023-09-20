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
import { CreateFileDto } from './dto/file.dto';
import { VendorsBankEntity } from './entities/vendors-bank.entity';
import { VendorsBankDto } from './dto/bank-vendor.dto';
import { ShareholdersEntity } from './entities/shareholder.entity';
@Injectable()
export class VendorRegistrationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
    @InjectRepository(ServicesEntity)
    private readonly serviceRepository: Repository<ServicesEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(FilesEntity)
    private readonly fileRepository: Repository<FilesEntity>,
  ) { }
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
    const vender = await this.vendorRepository.find({ where: { userId: data.data.userId }, relations: ["shareholders"] })
    console.log(vender)
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
        const vender = await this.vendorRepository.find(data?.data?.userId)
        console.log(vender)
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
        console.log('cccccccccccccccccccccccc : ', data.data.data)
        if (data.data.data?.shareHolders?.shareHoldersTable) {
          const shareHolders = data.data?.data.shareHolders?.shareHoldersTable;
          console.log('cccccccccccccccccccccccc : ', data.data.data?.shareHolders?.shareHoldersTable)
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
        return result
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
        const vender = await this.vendorRepository.find(data?.data?.userId)
        console.log(vender)
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
        console.log('cccccccccccccccccccccccc : ', data.data.data)
        if (data.data.data?.shareHolders?.shareHoldersTable) {
          const shareHolders = data.data?.data.shareHolders?.shareHoldersTable;
          console.log('cccccccccccccccccccccccc : ', data.data.data?.shareHolders?.shareHoldersTable)
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
        return result
      } catch (error) {
        console.log('error : ', error);
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
    //end of data
    // console.log('datadatadatadatadatadatadata ', data)

  }
  async addVendorInformations(data: InsertAllDataDto): Promise<any> {
    const vender = await this.vendorRepository.find({ where: { userId: data.data.userId, status: "Save as Draft" }, relations: ["shareholders", "vendorAccounts", "vendorAccounts.bank"] })
    console.log('vender ', vender)
    if (data?.data?.status == "Save as Draft") {
      // console.log('vendervendervender : ', vender)
      const metadata = {
        addressInformation: data.data.data.addressInformation,
        contactPersons: data.data.data.contactPersons,
        beneficialOwnership: data.data.data.beneficialOwnership,
        areasOfBusinessInterest: data.data.data.areasOfBusinessInterest,
        // bankAccountDetails: data.data.data.bankAccountDetails,
        businessSizeAndOwnership: data.data.data.businessSizeAndOwnership
      };
      const businessSizeAndOwnership = data.data.data.businessSizeAndOwnership
      const basicRegistration = data.data.data.basicRegistration
      const shareHolders = data.data.data.shareHolders.shareHoldersTable;
      const bankAccountDetails = data.data.data.bankAccountDetails.bankAccountDetailsTable
      const supportingDocuments = data.data.data.supportingDocuments

      // console.log('bankAccountDetailsbankAccountDetailsbankAccountDetailsbankAc: ', bankAccountDetails)
      const vendorsEntity = vender.length > 0 ? vender[0] : new VendorsEntity
      // vendorsEntity.id = vender.length > 0 ? vender[0]?.id : undefined
      vendorsEntity.userId = data?.data?.userId;
      vendorsEntity.status = data?.data?.status;
      vendorsEntity.metaData = JSON.parse(JSON.stringify(metadata))
      //basicRegistration Information 
      vendorsEntity.country = basicRegistration.country;
      vendorsEntity.district = basicRegistration.district;
      vendorsEntity.formOfEntity = basicRegistration.formOfBusiness;
      vendorsEntity.country = basicRegistration.country;
      vendorsEntity.origin = basicRegistration.businessCompanyOrigin;
      vendorsEntity.name = basicRegistration.nameOfBusinessCompany;
      //shareHolders Information
      let shareHoldersEntity = []
      shareHoldersEntity = shareHolders.length > 0 ? shareHolders?.map((elemet) => {
        return {
          id: elemet?.id,// this id will make the operation update if its drafted already
          share: elemet?.share,
          fullName: elemet?.fullName,
          Nationality: elemet?.nationality,
        };
      }) : undefined;
      vendorsEntity.shareholders = shareHoldersEntity
      // Bank information Maping 
      const bankDetails = bankAccountDetails.length > 0 ? bankAccountDetails.map((element) => {
        return {
          AccountHolderFullName: element.AccountHolderFullName,
          AccountNumber: element.AccountNumber,
          IBAN: element.IBAN,
          bankSwift: element.bankSwift,
          bankId: element.bankId,
          branchAddress: element.branchAddress,
          branchName: element.branchName,
          currency: element.currency,
          hashValue: element.hashValue,
          id: element?.id,
          status: element.status,
        }

      }) : undefined
      // console.log('dddddddddddddddddddddd : ', vendorsEntity.vendorAccounts)

      vendorsEntity.vendorAccounts = bankDetails
      // console.log('vendorsEntity : ', vendorsEntity)

      // console.log('dddddddddd : ', vendorsEntity.vendorAccounts)
      const result = await this.vendorRepository.save(vendorsEntity);
      return result
    }
  }
  async getVendorId(vendorId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneBy({ id: vendorId });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendorByUserId(userId: string): Promise<VendorsResponseDto> {
    try {
      const vendorEntity = await this.vendorRepository.findOneBy({ userId: userId });
      return VendorsResponseDto.fromEntity(vendorEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getVendors(): Promise<VendorsResponseDto[]> {
    try {
      const vendorEntity = await this.vendorRepository.find();
      return vendorEntity.map((element) => VendorsResponseDto.fromEntity(element));
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  // add vendor Bank
  // async addBankToVendor(bankDetailInfo: VendorsBankDto): Promise<any> {
  //   try {
  //     const bankDetailDto = new VendorsBankDto()
  //     bankDetailDto.AccountHolderFullName = bankDetailInfo.AccountHolderFullName
  //     bankDetailDto.AccountNumber = bankDetailInfo.AccountNumber
  //     bankDetailDto.IBAN = bankDetailInfo.IBAN
  //     bankDetailDto.bank = bankDetailInfo.bank
  //     bankDetailDto.bankSwift = bankDetailInfo.bankSwift
  //     bankDetailDto.branchAddress = bankDetailInfo.branchAddress
  //     bankDetailDto.branchName = bankDetailInfo.branchName
  //     bankDetailDto.currency = bankDetailInfo.currency
  //     bankDetailDto.hashValue = bankDetailInfo.hashValue
  //     bankDetailDto.id = bankDetailInfo?.id
  //     bankDetailDto.status = bankDetailInfo.status

  //     // bankDetailDto.vendor = bankDetailInfo?.vendor


  //     const vendorEntity = await this.vendorsBankRepository.save();
  //     return vendorEntity.map((element) => VendorsResponseDto.fromEntity(element));
  //   } catch (error) {
  //     throw new HttpException(error, HttpStatus.BAD_REQUEST);
  //   }
  // }
  // file upload 
  // async uploadAttachment(filePath: string, filename: string) {
  //   var Minio = require('minio')

  //   try {
  //     var minioClient = new Minio.Client({
  //       endPoint: 'localhost',
  //       port: 9000,
  //       useSSL: false,
  //       accessKey: 'uCQ0bN1TSUQbcNtZgpL6',
  //       secretKey: 'ZPnoE48fJyCiDwD5h4A2bpy6scMtnvuybMcBB808',
  //     })
  //     var minioClient = new Minio.Client({
  //       endPoint: 'localhost',
  //       port: 9000,
  //       useSSL: false,
  //       accessKey: 'uCQ0bN1TSUQbcNtZgpL6',
  //       secretKey: 'ZPnoE48fJyCiDwD5h4A2bpy6scMtnvuybMcBB808',
  //     })
  //     // this is for geting list of folders in the server
  //     // const buckets = await minioClient.listBuckets()
  //     // console.log('Success', buckets)
  //     var Fs = require('fs')
  //     var file = 'C:/Users/yayas/OneDrive/Desktop/photo_2021-11-01_15-26-13.jpg'
  //     var fileStream = Fs.createReadStream(file)
  //     var fileStat = Fs.stat(file, function (err, stats) {
  //       if (err) {
  //         return console.log(err)
  //       }
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  //       const filename = 'my_ownName' + '-' + uniqueSuffix
  //       minioClient.putObject('vendor', filename, fileStream, stats.size, function (err, objInfo) {
  //         if (err) {
  //           return console.log(err) // err should be null
  //         }
  //         console.log('Success', objInfo)
  //         return objInfo
  //       })
  //     })
  //     return fileStat
  //   } catch (error) {
  //     console.log("error : ", error)
  //     throw new HttpException(error, HttpStatus.BAD_REQUEST);
  //   }
  // }
  async upload_MRA_TPINAttachment(filePath: string, fileType: string, vendorId: string) {
    var Minio = require('minio')

    try {
      var minioClient = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'uCQ0bN1TSUQbcNtZgpL6',
        secretKey: 'ZPnoE48fJyCiDwD5h4A2bpy6scMtnvuybMcBB808',
      })
      var Fs = require('fs')
      const fileDto = new CreateFileDto()

      fileDto.fileType = fileType;
      fileDto.path = filePath
      fileDto.vendorId = vendorId
      console.log('ffffffffffffffffffffffff : ', fileDto)

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const filename = fileType + "-" + uniqueSuffix
      fileDto.fileName = filename
      console.log('fileDto.fileNamefileDto.fileNamefileDto.fileNamefileDto.fileName : ', fileDto)

      var file = filePath // filePath conatins absolute path includeing file name 
      var fileStream = Fs.createReadStream(file)
      var fileStat = Fs.stat(file, async function (err, stats) {
        if (err) {
          return console.log(err)
        }




        minioClient.putObject('vendor', filename, fileStream, stats.size, function (err, objInfo) {
          if (err) {
            return console.log(err) // err should be null
          }
          console.log('Success', objInfo)


          return objInfo
        })
      })

      console.log('ggggggggggg : ', fileDto)
      if (fileDto.fileName) {
        const res = await this.fileRepository.save(fileDto)
        console.log('resresresresres : ', res)

        if (res) return res
      }
      return fileStat

    } catch (error) {
      console.log("error : ", error)
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
