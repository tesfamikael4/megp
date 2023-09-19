import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { BankDto } from "./bank.dto";
import { CreateVendorsDto } from "./vendor.dto";
import { BankAccountDetailEntity } from "../entities/bank-account-detail.entity";

export class VendorsBankDto {
    // @ApiProperty()
    // @IsNotEmpty()
    // @IsUUID()
    id: string;
    @ApiProperty()
    @IsNotEmpty()
    AccountHolderFullName: string;
    @ApiProperty()
    @IsNotEmpty()
    AccountNumber: string;
    @ApiProperty()
    @IsNotEmpty()
    branchName: string;
    @ApiProperty()
    @IsNotEmpty()
    branchAddress: string;
    @ApiProperty()
    @IsNotEmpty()
    currency: string;
    @ApiProperty()
    @IsNotEmpty()
    bankSwift: string;
    @ApiProperty()
    @IsNotEmpty()
    IBAN: string;
    @ApiProperty()
    @IsNotEmpty()
    status: string;
    @ApiProperty()
    @IsNotEmpty()
    hashValue: string;


    metaData: JSON;

    vendor: CreateVendorsDto;
    bank: BankDto;

    static fromDto(dto: VendorsBankDto): BankAccountDetailEntity {
        const entity = new BankAccountDetailEntity();
        if (!dto) {
            return;
        }
        entity.id = dto?.id;
        entity.status = dto.status;
        entity.AccountHolderFullName = dto.AccountHolderFullName;
        entity.hashValue = dto.hashValue;
        entity.currency = dto.currency;
        entity.branchName = dto.branchName;
        entity.branchAddress = dto.branchAddress;

        entity.bankSwift = dto.bankSwift;

        entity.IBAN = dto.IBAN;

        entity.AccountNumber = dto.AccountNumber;
        entity.metaData = dto.metaData;

        entity.vendor = CreateVendorsDto.fromDto(dto.vendor)
        entity.bank = BankDto.fromDto(dto.bank);

        return entity;
    }
    static fromDtos(dto: VendorsBankDto[]): BankAccountDetailEntity[] {
        // const entity = dto.map((element) => this.fromDto(element))

        return dto.map((element) => this.fromDto(element))

    }

}
