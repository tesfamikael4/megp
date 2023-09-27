import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { MandateResponseDto } from './mandate.dto';

export class CreateMandatePermissionDto {
  id: string;
  @ApiProperty()
  @IsUUID()
  mandateId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionName: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionKey: string;
  @ApiProperty()
  @IsNotEmpty()
  applicationKey: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  applicationId: string;
  @ApiProperty()
  @IsNotEmpty()
  applicationName: string;

  static fromDto(
    mandatePermissionDto: CreateMandatePermissionDto,
  ): MandatePermission {
    const mandatePermission: MandatePermission = new MandatePermission();
    // if (!mandatePermissionDto) {
    //   return;
    // }

    mandatePermission.id = mandatePermissionDto.id;

    mandatePermission.mandateId = mandatePermissionDto.mandateId;

    mandatePermission.permissionId = mandatePermissionDto.permissionId;

    mandatePermission.permissionName = mandatePermissionDto.permissionName;

    mandatePermission.permissionKey = mandatePermissionDto.permissionKey;

    mandatePermission.applicationName = mandatePermissionDto.applicationName;

    mandatePermission.applicationId = mandatePermissionDto.applicationId;

    mandatePermission.applicationKey = mandatePermissionDto.applicationKey;

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
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  seedManPerId: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;
  mandate: MandateResponseDto;
  static fromDto(
    mandatePermissionDto: UpdateMandatePermissionDto,
  ): MandatePermission {
    const mandatePermission: MandatePermission = new MandatePermission();
    // if (!mandatePermissionDto) {
    //   return;
    // }
    mandatePermission.id = mandatePermissionDto.id;

    mandatePermission.mandateId = mandatePermissionDto.mandateId;

    mandatePermission.permissionId = mandatePermissionDto.permissionId;

    mandatePermission.permissionName = mandatePermissionDto.permissionName;

    mandatePermission.applicationName = mandatePermissionDto.applicationName;

    mandatePermission.seedManPerId = mandatePermissionDto.seedManPerId;

    mandatePermission.organizationId = mandatePermissionDto.organizationId;

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

    mandatePermissionDto.permissionName = mandatePermission.permissionName;

    mandatePermissionDto.applicationName = mandatePermission.applicationName;

    mandatePermissionDto.seedManPerId = mandatePermission.seedManPerId;

    mandatePermissionDto.organizationId = mandatePermission.organizationId;

    if (mandatePermission.mandate) {
      mandatePermissionDto.mandate = MandateResponseDto.fromDto(
        mandatePermission.mandate,
      );
    }
    return mandatePermissionDto;
  }

  static toDtos(mandatePermissions: MandatePermission[]) {
    return mandatePermissions?.map((mandatePermission) =>
      MandatePermissionResponseDto.toDto(mandatePermission),
    );
  }
}
