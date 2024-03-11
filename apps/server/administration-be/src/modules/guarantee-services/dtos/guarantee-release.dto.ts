import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { GuaranteeRelease } from 'src/entities/guarantee-release.entity';

export class CreateGuaranteeReleaseDto {
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  @ApiProperty()
  @IsUUID()
  guaranteeId: string;
  @ApiProperty()
  @IsEnum(['reviewed', 'approved', 'rejected'])
  status: string;

  static fromDto(dto: CreateGuaranteeReleaseDto): GuaranteeRelease {
    const entity = new GuaranteeRelease();
    if (!dto) {
      return null;
    }
    entity.reason = dto.reason;
    entity.guaranteeId = dto.guaranteeId;
    entity.status = dto.status;
    return entity;
  }

  static fromDtos(dto: CreateGuaranteeReleaseDto[]): GuaranteeRelease[] {
    return dto?.map((d) => CreateGuaranteeReleaseDto.fromDto(d));
  }
}

export class UpdateGuaranteeReleaseDto extends CreateGuaranteeReleaseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateGuaranteeReleaseDto): GuaranteeRelease {
    const entity = new GuaranteeRelease();
    if (!dto) {
      return null;
    }
    entity.id = dto.id;
    entity.reason = dto.reason;
    entity.guaranteeId = dto.guaranteeId;
    entity.status = dto.status;

    return entity;
  }
}

export class GuaranteeReleaseResponseDto extends UpdateGuaranteeReleaseDto {
  static fromEntity(entity: GuaranteeRelease): GuaranteeReleaseResponseDto {
    const response = new GuaranteeReleaseResponseDto();
    response.id = entity.id;
    response.reason = entity.reason;
    response.guaranteeId = entity.guaranteeId;
    response.status = entity.status;

    return response;
  }
}
