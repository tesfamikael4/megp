import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BankDto } from './bank.dto';
import { CreateVendorsDto } from './vendor.dto';
import { BankAccountDetailEntity } from '../entities/bank-account-detail.entity';

export class CreateBankAccountDetailDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountHoldersFullName: string;
  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
  @ApiProperty()
  @IsNotEmpty()
  bankId: string;
  @ApiProperty()
  // @IsNotEmpty()
  branchName: string;
  @ApiProperty()
  // @IsNotEmpty()
  bankBranchAddress: string;
  @ApiProperty()
  // @IsNotEmpty()
  currency: string;
  @ApiProperty()
  // @IsNotEmpty()
  bankSWIFT_BICCode: string;
  @ApiProperty()
  // @IsNotEmpty()
  iBAN: string;
  @ApiProperty()
  // @IsNotEmpty()
  status: string;
  @ApiProperty()
  // @IsNotEmpty()
  hashValue: string;
  @ApiProperty()
  // @IsNotEmpty()
  bankName: string;
  @ApiProperty()
  metaData: JSON;

  bank: BankDto;

  static fromDto(dto: CreateBankAccountDetailDto): BankAccountDetailEntity {
    const entity = new BankAccountDetailEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.accountHolderFullName = dto.accountHoldersFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto.branchName;
    entity.branchAddress = dto.branchName;
    entity.currency = dto.currency;
    entity.bankSwift = dto.iBAN;
    entity.IBAN = dto.iBAN;
    entity.status = dto.status;
    entity.hashValue = dto.hashValue;
    entity.bankName = dto.bankName;
    entity.metaData = dto.metaData;

    return entity;
  }
  static fromDtos(
    dto: CreateBankAccountDetailDto[],
  ): BankAccountDetailEntity[] {
    // const entity = dto.map((element) => this.fromDto(element))

    return dto.map((element) => this.fromDto(element));
  }
}

export class BankAccountDetailResponse extends CreateBankAccountDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  vendor: CreateVendorsDto;
  bank: BankDto;

  static fromDto(dto: CreateBankAccountDetailDto): BankAccountDetailEntity {
    const entity = new BankAccountDetailEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.accountHolderFullName = dto.accountHoldersFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto.branchName;
    entity.branchAddress = dto.bankBranchAddress;
    entity.currency = dto.currency;
    entity.bankSwift = dto.bankSWIFT_BICCode;
    entity.IBAN = dto.iBAN;
    entity.status = dto.status;
    entity.hashValue = dto.hashValue;
    entity.bankName = dto.bankName;
    entity.metaData = dto.metaData;

    return entity;
  }
  static fromEntity(dto: BankAccountDetailEntity): BankAccountDetailResponse {
    const entity = new BankAccountDetailResponse();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.accountHoldersFullName = dto.accountHolderFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto?.branchName;
    entity.bankBranchAddress = dto?.branchAddress;
    entity.currency = dto.currency;
    entity.bankSWIFT_BICCode = dto?.bankSwift;
    entity.iBAN = dto?.IBAN;
    entity.status = dto?.status;
    entity.hashValue = dto?.hashValue;
    entity.bankName = dto?.bankName;
    entity.metaData = dto?.metaData;

    return entity;
  }
  static fromDtos(
    dto: CreateBankAccountDetailDto[],
  ): BankAccountDetailEntity[] {
    // const entity = dto.map((element) => this.fromDto(element))

    return dto.map((element) => this.fromDto(element));
  }
}
