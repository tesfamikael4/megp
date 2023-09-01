import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
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

  static fromDto(organizationDto: CreateOrganizationDto): Organization {
    const organization: Organization = new Organization();
    if (!organizationDto) {
      return;
    }
    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.type = organizationDto.type;



    return organization;
  }

  static fromDtos(organizationDto: CreateOrganizationDto[]) {
    return organizationDto?.map(organization => CreateOrganizationDto.fromDto(organization));
  }
}


export class UpdateOrganizationDto extends CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(organizationDto: UpdateOrganizationDto): Organization {
    const organization: Organization = new Organization();
    if (!organizationDto) {
      return;
    }
    organization.id = organizationDto.id;

    organization.name = organizationDto.name;

    organization.code = organizationDto.code;

    organization.type = organizationDto.type;



    return organization;
  }
}

export class OrganizationResponseDto extends UpdateOrganizationDto {

  static toDto(organization: Organization): OrganizationResponseDto {
    const organizationDto: OrganizationResponseDto = new OrganizationResponseDto();

    organizationDto.id = organization.id;

    organizationDto.name = organization.name;

    organizationDto.code = organization.code;

    organizationDto.type = organization.type;

    return organizationDto;
  }

  static toDtos(organizations: Organization[]) {
    return organizations?.map(organization => OrganizationResponseDto.toDto(organization));
  }
}