import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { GuaranteeExtension } from 'src/entities/guarantee-extension.entity';

export class CreateGuaranteeExtensionDto {
  @ApiProperty()
  @IsNotEmpty()
  guaranteeId: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remark?: string;
  @ApiProperty()
  @IsDate()
  extensionDate: Date;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['reviewed', 'approved', 'rejected'])
  status: string;

  static fromDto(dto: CreateGuaranteeExtensionDto): GuaranteeExtension {
    const entity = new GuaranteeExtension();
    if (!dto) {
      return null;
    }
    entity.guaranteeId = dto.guaranteeId;
    entity.remark = dto.remark;
    entity.extensionDate = dto.extensionDate;
    entity.status = dto.status;

    return entity;
  }

  static fromDtos(dto: CreateGuaranteeExtensionDto[]): GuaranteeExtension[] {
    return dto?.map((d) => CreateGuaranteeExtensionDto.fromDto(d));
  }
}

export class UpdateGuaranteeExtensionDto extends CreateGuaranteeExtensionDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateGuaranteeExtensionDto): GuaranteeExtension {
    const entity = new GuaranteeExtension();
    if (!dto) {
      return null;
    }
    entity.id = dto.id;
    entity.guaranteeId = dto.guaranteeId;
    entity.remark = dto.remark;
    entity.extensionDate = dto.extensionDate;
    entity.status = dto.status;

    return entity;
  }
}

export class GuaranteeExtensionResponseDto extends UpdateGuaranteeExtensionDto {
  static fromEntity(entity: GuaranteeExtension): GuaranteeExtensionResponseDto {
    const response = new GuaranteeExtensionResponseDto();
    response.id = entity.id;
    response.guaranteeId = entity.guaranteeId;
    response.remark = entity.remark;
    response.extensionDate = entity.extensionDate;
    response.status = entity.status;

    return response;
  }
}
