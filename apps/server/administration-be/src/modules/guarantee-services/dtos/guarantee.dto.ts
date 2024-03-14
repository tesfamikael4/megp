import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsDate, IsNumber } from 'class-validator';
import { Guarantee } from 'src/entities/guarantee.entity';

export class CreateGuaranteeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  vendorId: string;
  @ApiProperty()
  @IsDate()
  startDate: Date;
  @ApiProperty()
  @IsDate()
  endDate: Date;
  @ApiProperty()
  @IsEnum(['bid guarantee', 'advanced', 'performance', 'retention'])
  type: string;
  @ApiProperty()
  objectType: string;
  @ApiProperty({ required: false })
  minValidityDate?: number;
  @ApiProperty({ required: false })
  guarantorValidityDate?: number;
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty()
  @IsNotEmpty()
  objectId: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  attachment: string;
  @ApiProperty()
  @IsEnum(['reviewed', 'approved', 'rejected'])
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
