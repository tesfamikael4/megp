import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BanksEntity } from 'src/entities';
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
  static fromDto(dto: BankDto): BanksEntity {
    const entity = new BanksEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.bankName = dto.bankName;
    entity.metaData = dto?.metaData;
    return entity;
  }
}
export class BankResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  bankName: string;
  @ApiProperty()
  // @IsNotEmpty()
  metaData: JSON;

  static fromEntity(dto: BanksEntity): BankResponse {
    const bankResponse = new BankResponse();
    if (!dto) {
      return;
    }
    bankResponse.id = dto.id;
    bankResponse.bankName = dto.bankName;
    bankResponse.metaData = dto?.metaData;
    return bankResponse;
  }
}
