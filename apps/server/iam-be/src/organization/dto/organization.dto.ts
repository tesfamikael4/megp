import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Organization } from '../entities/organization.entity';
import {
  CreateOrganizationTypeDto,
  OrganizationTypeResponseDto,
} from './organization-type.dto';
import {
  CreateOrganizationSectorDto,
  OrganizationSectorResponseDto,
} from './organization-sector.dto';
import {
  CreateOrganizationMandateDto,
  OrganizationMandateResponseDto,
} from './organization-mandate.dto';

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
  @IsUUID()
  @IsOptional()
  sectorId: string;

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
    // if (!organizationDto) {
    //   return;
    // }
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

    organization.sectorId = organizationDto.sectorId;

    return organization;
  }

  static fromDtos(organizationDto: CreateOrganizationDto[]) {
    return organizationDto?.map((organization) =>
      CreateOrganizationDto.fromDto(organization),
    );
  }
}

export class SetAddressDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsObject()
  address: any;
}
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  address: any;
  logo: any;
  organizationType: CreateOrganizationTypeDto;
  sector: CreateOrganizationSectorDto;
  organizationMandates: CreateOrganizationMandateDto[];

  static fromDto(organizationDto: UpdateOrganizationDto): Organization {
    const organization: Organization = new Organization();
    // if (!organizationDto) {
    //   return;
    // }
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

    organization.sectorId = organizationDto.sectorId;

    if (organizationDto.logo) {
      organization.logo = organizationDto.logo;
    }
    if (organizationDto.address) {
      organization.address = organizationDto.address;
    }

    // if (organizationDto.organizationMandates) {
    //   organization.organizationMandates = OrganizationMandateResponseDto.fromDtos(organizationDto.organizationMandates);
    // }
    return organization;
  }
}

export class UpdateAddressOrLogoDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  @ApiProperty()
  address: any;
  @ApiProperty()
  logo: any;
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

    organizationDto.sectorId = organization.sectorId;

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
    if (organization.sector) {
      organizationDto.sector = OrganizationSectorResponseDto.toDto(
        organization.sector,
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

    return organization;
  }
}
