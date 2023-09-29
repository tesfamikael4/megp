import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { Mandate } from '../entities/mandate.entity';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { MandatePermissionResponseDto } from './mandate-permission.dto';

export class CreateMandateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  versionNo: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSingleAssignment: boolean;
  static fromDto(mandateDto: CreateMandateDto): Mandate {
    const mandate: Mandate = new Mandate();
    // if (!mandateDto) {
    //   return;
    // }
    mandate.name = mandateDto.name;

    mandate.description = mandateDto.description;

    mandate.key = mandateDto.key;

    mandate.versionNo = mandateDto.versionNo;

    mandate.isActive = mandateDto.isActive;

    mandate.isSingleAssignment = mandateDto.isSingleAssignment;

    return mandate;
  }

  static fromDtos(mandateDto: CreateMandateDto[]) {
    return mandateDto?.map((mandate) => CreateMandateDto.fromDto(mandate));
  }
}

export class UpdateMandateDto extends CreateMandateDto {
  @ApiProperty()
  @IsString()
  id: string;
  mandatePermissions: MandatePermissionResponseDto[];
  static fromDto(mandateDto: UpdateMandateDto): Mandate {
    const mandate: Mandate = new Mandate();
    // if (!mandateDto) {
    //   return;
    // }
    mandate.id = mandateDto.id;

    mandate.name = mandateDto.name;

    mandate.description = mandateDto.description;

    mandate.key = mandateDto.key;

    mandate.versionNo = mandateDto.versionNo;

    mandate.isActive = mandateDto.isActive;

    mandate.isSingleAssignment = mandateDto.isSingleAssignment;

    return mandate;
  }
}

export class MandateResponseDto extends UpdateMandateDto {
  static toDto(mandate: Mandate): MandateResponseDto {
    const mandateDto: MandateResponseDto = new MandateResponseDto();

    mandateDto.id = mandate.id;

    mandateDto.name = mandate.name;

    mandateDto.description = mandate.description;

    mandateDto.key = mandate.key;

    mandateDto.versionNo = mandate.versionNo;

    mandateDto.isActive = mandate.isActive;

    mandateDto.isSingleAssignment = mandate.isSingleAssignment;
    if (mandate.mandatePermissions) {
      mandateDto.mandatePermissions = MandatePermissionResponseDto.toDtos(
        mandate.mandatePermissions,
      );
    }

    return mandateDto;
  }

  static toDtos(mandates: Mandate[]) {
    return mandates?.map((mandate) => MandateResponseDto.toDto(mandate));
  }
}
