import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Organization } from '../entities/organization.entity';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  budgetType: string;

  static fromDto(organizationDto: CreateOrganizationDto): Organization | null {
    const organization: Organization = new Organization();
    if (!organizationDto) {
      return null;
    }

    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.type = organizationDto.type;

    organization.budgetType = organizationDto.budgetType;

    return organization;
  }

  static fromDtos(organizationDto: CreateOrganizationDto[]) {
    return organizationDto?.map((organization) =>
      CreateOrganizationDto.fromDto(organization),
    );
  }
}

export class UpdateOrganizationDto extends CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  static fromDto(organizationDto: UpdateOrganizationDto): Organization | null {
    const organization: Organization = new Organization();
    if (!organizationDto) {
      return null;
    }

    organization.id = organizationDto.id;

    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.type = organizationDto.type;

    organization.isActive = organizationDto.isActive;

    return organization;
  }
}

export class OrganizationResponseDto extends UpdateOrganizationDto {
  static toDto(organization: Organization): OrganizationResponseDto | null {
    const organizationDto: OrganizationResponseDto =
      new OrganizationResponseDto();
    if (!organizationDto) {
      return null;
    }

    organizationDto.id = organization.id;

    organizationDto.name = organization.name;

    organizationDto.code = organization.code;

    organizationDto.type = organization.type;

    organizationDto.isActive = organization.isActive;

    return organizationDto;
  }

  static toDtos(organizations: Organization[]) {
    return organizations?.map((organization) =>
      OrganizationResponseDto.toDto(organization),
    );
  }
}
