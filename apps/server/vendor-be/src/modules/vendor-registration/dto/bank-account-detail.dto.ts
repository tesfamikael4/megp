import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BankDto } from './bank.dto';
import { CreateVendorsDto } from './vendor.dto';
import { BankAccountDetailEntity } from 'src/entities';

export class CreateBankAccountDetailDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountHolderFullName: string;
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
  @IsOptional()
  branchName: string;
  @ApiProperty()
  @IsOptional()
  branchAddress: string;
  @ApiProperty()
  @IsOptional()
  currency: string;
  @ApiProperty()
  @IsOptional()
  bankSwift: string;
  @ApiProperty()
  @IsOptional()
  IBAN: string;
  @ApiProperty()
  @IsOptional()
  status: string;
  @ApiProperty()
  @IsOptional()
  hashValue: string;
  @ApiProperty()
  @IsOptional()
  bankName: string;
  @ApiProperty()
  @IsOptional()
  metaData: JSON;

  @ApiProperty()
  @IsNotEmpty()
  accountType: string;
  @ApiProperty()
  isDefualt: boolean;
  bank: BankDto;

  static fromDto(dto: CreateBankAccountDetailDto): BankAccountDetailEntity {
    const entity = new BankAccountDetailEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.accountHolderFullName = dto.accountHolderFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto.branchName;
    entity.branchAddress = dto.branchName;
    entity.currency = dto.currency;
    entity.swiftCode = dto.bankSwift;
    entity.IBAN = dto.IBAN;
    entity.status = dto.status;
    entity.hashValue = dto.hashValue;
    entity.bankName = dto.bankName;
    entity.accountType = dto.accountType;
    entity.isDefualt = dto.isDefualt;
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
    entity.accountHolderFullName = dto.accountHolderFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto.branchName;
    entity.branchAddress = dto.branchAddress;
    entity.currency = dto.currency;
    entity.swiftCode = dto.bankSwift;
    entity.IBAN = dto.IBAN;
    entity.status = dto.status;
    entity.hashValue = dto.hashValue;
    entity.bankName = dto.bankName;
    entity.accountType = dto.accountType;
    entity.isDefualt = dto.isDefualt;
    entity.metaData = dto.metaData;

    return entity;
  }
  static toResponse(dto: BankAccountDetailEntity): BankAccountDetailResponse {
    const entity = new BankAccountDetailResponse();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.accountHolderFullName = dto.accountHolderFullName;
    entity.accountNumber = dto.accountNumber;
    entity.vendorId = dto.vendorId;
    entity.bankId = dto.bankId;
    entity.branchName = dto?.branchName;
    entity.branchAddress = dto?.branchAddress;
    entity.currency = dto.currency;
    entity.bankSwift = dto?.swiftCode;
    entity.IBAN = dto?.IBAN;
    entity.status = dto?.status;
    entity.hashValue = dto?.hashValue;
    entity.bankName = dto?.bankName;
    entity.accountType = dto?.accountType;
    entity.isDefualt = dto?.isDefualt;
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
