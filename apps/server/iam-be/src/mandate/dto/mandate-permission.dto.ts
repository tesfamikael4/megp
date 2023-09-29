import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsArray,
  IsObject,
  IsOptional,
} from 'class-validator';
import { MandatePermission } from '../entities/mandate-permission.entity';

export class CreateMandatePermissionDto {
  @ApiProperty()
  @IsString()
  mandateId: string;

  @ApiProperty()
  @IsString()
  permissionId: string;

  @ApiProperty()
  @IsString()
  applicationId: string;

  @ApiProperty()
  @IsString()
  applicationKey: string;

  @ApiProperty()
  @IsString()
  permissionKey: string;

  static fromDto(
    mandatePermissionDto: CreateMandatePermissionDto,
  ): MandatePermission {
    const mandatePermission: MandatePermission = new MandatePermission();
    if (!mandatePermissionDto) {
      return;
    }
    mandatePermission.mandateId = mandatePermissionDto.mandateId;

    mandatePermission.permissionId = mandatePermissionDto.permissionId;

    mandatePermission.applicationId = mandatePermissionDto.applicationId;

    mandatePermission.applicationKey = mandatePermissionDto.applicationKey;

    mandatePermission.permissionKey = mandatePermissionDto.permissionKey;

    return mandatePermission;
  }

  static fromDtos(mandatePermissionDto: CreateMandatePermissionDto[]) {
    return mandatePermissionDto?.map((mandatePermission) =>
      CreateMandatePermissionDto.fromDto(mandatePermission),
    );
  }
}

export class UpdateMandatePermissionDto extends CreateMandatePermissionDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(
    mandatePermissionDto: UpdateMandatePermissionDto,
  ): MandatePermission {
    const mandatePermission: MandatePermission = new MandatePermission();
    if (!mandatePermissionDto) {
      return;
    }
    mandatePermission.id = mandatePermissionDto.id;

    mandatePermission.mandateId = mandatePermissionDto.mandateId;

    mandatePermission.permissionId = mandatePermissionDto.permissionId;

    mandatePermission.applicationId = mandatePermissionDto.applicationId;

    mandatePermission.applicationKey = mandatePermissionDto.applicationKey;

    mandatePermission.permissionKey = mandatePermissionDto.permissionKey;

    return mandatePermission;
  }
}

export class MandatePermissionResponseDto extends UpdateMandatePermissionDto {
  static toDto(
    mandatePermission: MandatePermission,
  ): MandatePermissionResponseDto {
    const mandatePermissionDto: MandatePermissionResponseDto =
      new MandatePermissionResponseDto();

    mandatePermissionDto.id = mandatePermission.id;

    mandatePermissionDto.mandateId = mandatePermission.mandateId;

    mandatePermissionDto.permissionId = mandatePermission.permissionId;

    mandatePermissionDto.applicationId = mandatePermission.applicationId;

    mandatePermissionDto.applicationKey = mandatePermission.applicationKey;

    mandatePermissionDto.permissionKey = mandatePermission.permissionKey;

    return mandatePermissionDto;
  }

  static toDtos(mandatePermissions: MandatePermission[]) {
    return mandatePermissions?.map((mandatePermission) =>
      MandatePermissionResponseDto.toDto(mandatePermission),
    );
  }
}
