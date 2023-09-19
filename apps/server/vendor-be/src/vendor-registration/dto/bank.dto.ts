import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { VendorsBankDto } from './bank-vendor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BanksEntity } from '../entities/bank.entity';
@Entity({ name: 'file' })
export class BankDto {
    // @ApiProperty()
    // @IsNotEmpty()
    // @IsUUID()
    id: string;
    @ApiProperty()
    @IsNotEmpty()
    bankName: string;
    @ApiProperty()
    @IsNotEmpty()
    metaData: JSON;

    vendorAccounts: VendorsBankDto[];
    static fromDto(dto: BankDto): BanksEntity {
        const entity = new BanksEntity();
        if (!dto) {
            return;
        }
        entity.id = dto?.id;
        entity.bankName = dto.bankName;
        entity.metaData = dto?.metaData;
        // entity.vendorAccounts = dto.vendorAccounts.map((element) => VendorsBankDto.fromDto(dto.vendorAccounts));

        console.log(entity);
        return entity;
    }
}
