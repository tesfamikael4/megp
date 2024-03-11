import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';

export class CreateGuaranteeForfeitDto {
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  @ApiProperty()
  @IsUUID()
  guaranteeId: string;
  @ApiProperty({ type: 'json', required: false })
  @IsOptional()
  attachment?: any;
  @ApiProperty()
  @IsEnum(['reviewed', 'approved', 'rejected'])
  status: string;

  static fromDto(dto: CreateGuaranteeForfeitDto): GuaranteeForfeit {
    const entity = new GuaranteeForfeit();
    if (!dto) {
      return null;
    }
    // Map the properties from dto to entity
    entity.reason = dto.reason;
    entity.guaranteeId = dto.guaranteeId;
    entity.attachment = dto.attachment;
    entity.status = dto.status;

    return entity;
  }

  static fromDtos(dto: CreateGuaranteeForfeitDto[]): GuaranteeForfeit[] {
    return dto?.map((d) => CreateGuaranteeForfeitDto.fromDto(d));
  }
}

export class UpdateGuaranteeForfeitDto extends CreateGuaranteeForfeitDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateGuaranteeForfeitDto): GuaranteeForfeit {
    const entity = new GuaranteeForfeit();
    if (!dto) {
      return;
    }
    // Map the properties from dto to entity
    entity.id = dto.id;
    entity.reason = dto.reason;
    entity.guaranteeId = dto.guaranteeId;
    entity.attachment = dto.attachment;
    entity.status = dto.status;
    return entity;
  }
}
export class GuaranteeForfeitResponseDto extends UpdateGuaranteeForfeitDto {
  static fromEntity(entity: GuaranteeForfeit): GuaranteeForfeitResponseDto {
    const response = new GuaranteeForfeitResponseDto();
    // Map the properties from entity to dto
    response.id = entity.id;
    response.reason = entity.reason;
    response.guaranteeId = entity.guaranteeId;
    response.attachment = entity.attachment;
    response.status = entity.status;

    return response;
  }
}
