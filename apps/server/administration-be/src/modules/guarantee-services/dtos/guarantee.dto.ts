import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import {
  Guarantee,
  GuaranteeStatusEnum,
  GuaranteeTypeEnum,
} from 'src/entities/guarantee.entity';

export class CreateGuaranteeDto {
  @ApiProperty()
  @IsOptional()
  name: string;
  @ApiHideProperty()
  vendorId: string;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate: Date;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({ default: GuaranteeTypeEnum.BID_SECURITY })
  @IsEnum(GuaranteeTypeEnum)
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsOptional()
  objectType: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  minValidityDate?: Date;
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  guarantorValidityDate?: Date;
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty()
  @IsOptional()
  objectId: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsOptional()
  currencyType: string;

  @ApiProperty()
  @IsNotEmpty()
  guarantorId: string;
  @ApiProperty()
  @IsNotEmpty()
  guarantorBranchId: string;
  @ApiProperty({ required: false })
  remark?: string;

  @ApiProperty()
  @IsOptional()
  attachment: any;
  @ApiProperty({ default: GuaranteeStatusEnum.REQUESTED })
  @IsEnum(GuaranteeStatusEnum)
  @IsOptional()
  status: string;

  static fromDto(dto: CreateGuaranteeDto): Guarantee {
    const entity = new Guarantee();
    if (!dto) {
      return null;
    }
    // Map the properties from dto to entity
    entity.name = dto.name;
    entity.vendorId = dto.vendorId;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;
    entity.type = dto.type;
    entity.objectType = dto.objectType;
    entity.minValidityDate = dto.minValidityDate;
    entity.guarantorValidityDate = dto.guarantorValidityDate;
    entity.title = dto.title;
    entity.objectId = dto.objectId;
    entity.amount = dto.amount;
    entity.currencyType = dto.currencyType;
    entity.guarantorId = dto.guarantorId;
    entity.guarantorBranchId = dto.guarantorBranchId;
    entity.remark = dto.remark;
    entity.attachment = dto.attachment;
    entity.status = dto.status;

    return entity;
  }

  static fromDtos(dto: CreateGuaranteeDto[]): Guarantee[] {
    return dto?.map((d) => CreateGuaranteeDto.fromDto(d));
  }
}

export class UpdateGuaranteeDto extends CreateGuaranteeDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateGuaranteeDto): Guarantee {
    const entity = new Guarantee();
    if (!dto) {
      return;
    }
    // Map the properties from dto to entity
    entity.id = dto.id;
    entity.name = dto.name;
    entity.vendorId = dto.vendorId;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;
    entity.type = dto.type;
    entity.objectType = dto.objectType;
    entity.minValidityDate = dto.minValidityDate;
    entity.guarantorValidityDate = dto.guarantorValidityDate;
    entity.title = dto.title;
    entity.objectId = dto.objectId;
    entity.amount = dto.amount;
    entity.currencyType = dto.currencyType;
    entity.guarantorId = dto.guarantorId;
    entity.guarantorBranchId = dto.guarantorBranchId;
    entity.remark = dto.remark;
    entity.attachment = dto.attachment;
    entity.status = dto.status;
    entity.createdAt = new Date();

    return entity;
  }
}

export class GuaranteeResponseDto extends UpdateGuaranteeDto {
  static fromEntity(entity: Guarantee): GuaranteeResponseDto {
    const response = new GuaranteeResponseDto();
    // Map the properties from entity to dto
    response.id = entity.id;
    response.name = entity.name;
    response.vendorId = entity.vendorId;
    response.startDate = entity.startDate;
    response.endDate = entity.endDate;
    response.type = entity.type;
    response.objectType = entity.objectType;
    response.minValidityDate = entity.minValidityDate;
    response.guarantorValidityDate = entity.guarantorValidityDate;
    response.title = entity.title;
    response.objectId = entity.objectId;
    response.amount = entity.amount;
    response.currencyType = entity.currencyType;
    response.guarantorId = entity.guarantorId;
    response.guarantorBranchId = entity.guarantorBranchId;
    response.remark = entity.remark;
    response.attachment = entity.attachment;
    response.status = entity.status;
    return response;
  }
}
