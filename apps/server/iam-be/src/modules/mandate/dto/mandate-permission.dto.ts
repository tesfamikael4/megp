import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { MandatePermission } from '@entities';

export class CreateMandatePermissionDto {
  @ApiProperty()
  @IsUUID()
  mandateId: string;
  @ApiProperty()
  @IsUUID()
  permissionId: string;

  static fromDto(
    mandatePermissionDto: CreateMandatePermissionDto,
  ): MandatePermission {
    const mandatePermission: MandatePermission = new MandatePermission();
    if (!mandatePermissionDto) {
      return;
    }
    mandatePermission.mandateId = mandatePermissionDto.mandateId;

    mandatePermission.permissionId = mandatePermissionDto.permissionId;

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

    return mandatePermissionDto;
  }

  static toDtos(mandatePermissions: MandatePermission[]) {
    return mandatePermissions?.map((mandatePermission) =>
      MandatePermissionResponseDto.toDto(mandatePermission),
    );
  }
}
