import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Organization } from '@entities';
import {
  CreateOrganizationTypeDto,
  OrganizationTypeResponseDto,
} from './organization-type.dto';
import {
  CreateOrganizationMandateDto,
  OrganizationMandateResponseDto,
} from './organization-mandate.dto';
import { ContactNumberCommand } from 'src/shared/domain';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  order: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  budgetType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  typeId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  version: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isLocked: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deactivateRemark: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deleteRemark: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  taxIdentificationNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  externalOrganizationCode: string;

  static fromDto(organizationDto: CreateOrganizationDto): Organization {
    const organization: Organization = new Organization();
    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.order = organizationDto.order;

    organization.status = organizationDto.status;

    organization.shortName = organizationDto.shortName;

    organization.description = organizationDto.description;

    organization.isActive = organizationDto.isActive;

    organization.type = organizationDto.type;

    organization.budgetType = organizationDto.budgetType;

    organization.isLocked = organizationDto.isLocked;

    organization.version = organizationDto.version;

    organization.isLocked = organizationDto.isLocked;

    organization.deactivateRemark = organizationDto.deactivateRemark;

    organization.deleteRemark = organizationDto.deleteRemark;

    organization.taxIdentificationNumber =
      organizationDto.taxIdentificationNumber;

    organization.externalOrganizationCode =
      organizationDto.externalOrganizationCode;

    organization.typeId = organizationDto.typeId;

    return organization;
  }

  static fromDtos(organizationDto: CreateOrganizationDto[]) {
    return organizationDto?.map((organization) =>
      CreateOrganizationDto.fromDto(organization),
    );
  }
}

export class SetAddressDto {
  id: string;
  @ApiProperty()
  @IsObject()
  address: any;
}
export class UpdateOrganizationDto extends CreateOrganizationDto {
  id: string;
  address: any;
  logo: any;

  static fromDto(organizationDto: UpdateOrganizationDto): Organization {
    const organization: Organization = new Organization();
    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.order = organizationDto.order;

    organization.status = organizationDto.status;

    organization.shortName = organizationDto.shortName;

    organization.description = organizationDto.description;

    organization.isActive = organizationDto.isActive;

    organization.type = organizationDto.type;

    organization.budgetType = organizationDto.budgetType;

    organization.version = organizationDto.version;

    organization.isLocked = organizationDto.isLocked;

    organization.deactivateRemark = organizationDto.deactivateRemark;

    organization.deleteRemark = organizationDto.deleteRemark;

    organization.taxIdentificationNumber =
      organizationDto.taxIdentificationNumber;

    organization.externalOrganizationCode =
      organizationDto.externalOrganizationCode;

    organization.typeId = organizationDto.typeId;

    if (organizationDto.logo) {
      organization.logo = organizationDto.logo;
    }
    if (organizationDto.address) {
      organization.address = organizationDto.address;
    }
    return organization;
  }
}
export class Address {
  @ApiProperty()
  region: string;

  @ApiProperty()
  zoneOrSubCity: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  telephone: ContactNumberCommand;

  @ApiProperty()
  fax: ContactNumberCommand;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  houseNumber: string;

  @ApiProperty()
  mobileNumber: ContactNumberCommand;
}
export class UpdateAddressOrLogoDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id: string;
  @ApiProperty({ isArray: true, type: () => Address })
  address: Address;
  @ApiProperty()
  logo: JSON;
  static fromDto(organizationDto: UpdateAddressOrLogoDto): Organization {
    const organization: Organization = new Organization();
    organization.id = organizationDto.id;
    if (organizationDto.logo) {
      organization.logo = organizationDto.logo;
    }
    if (organizationDto.address) {
      organization.address = organizationDto.address;
    }
    return organization;
  }
}

export class OrganizationResponseDto extends UpdateOrganizationDto {
  organizationType: CreateOrganizationTypeDto;
  organizationMandates: CreateOrganizationMandateDto[];
  static toDto(organization: Organization): OrganizationResponseDto {
    const organizationDto = new OrganizationResponseDto();
    organizationDto.id = organization.id;

    organizationDto.name = organization.name;

    organizationDto.code = organization.code;

    organizationDto.order = organization.order;

    organizationDto.status = organization.status;

    organizationDto.shortName = organization.shortName;

    organizationDto.description = organization.description;

    organizationDto.isActive = organization.isActive;

    organizationDto.type = organization.type;

    organizationDto.budgetType = organization.budgetType;

    organizationDto.isLocked = organization.isLocked;

    organizationDto.version = organization.version;

    organizationDto.isLocked = organization.isLocked;

    organizationDto.deactivateRemark = organization.deactivateRemark;

    organizationDto.deleteRemark = organization.deleteRemark;

    organizationDto.taxIdentificationNumber =
      organization.taxIdentificationNumber;

    organizationDto.externalOrganizationCode =
      organization.externalOrganizationCode;

    organizationDto.typeId = organization.typeId;

    if (organization.logo) {
      organizationDto.logo = organization.logo;
    }
    if (organization.address) {
      organizationDto.address = organization.address;
    }
    if (organization.organizationType) {
      organizationDto.organizationType = OrganizationTypeResponseDto.toDto(
        organization.organizationType,
      );
    }

    if (organization.organizationMandates) {
      organizationDto.organizationMandates =
        OrganizationMandateResponseDto.toDtos(
          organization.organizationMandates,
        );
    }

    return organizationDto;
  }

  static toDtos(organizations: Organization[]) {
    return organizations?.map((organization) =>
      OrganizationResponseDto.toDto(organization),
    );
  }

  static toAddressDto(organization: Organization): OrganizationResponseDto {
    const organizationDto = new OrganizationResponseDto();
    organizationDto.address = organization.address;

    return organizationDto;
  }
}
