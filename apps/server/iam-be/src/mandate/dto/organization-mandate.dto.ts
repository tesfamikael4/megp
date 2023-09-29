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
import { OrganizationMandate } from '../entities/organization-mandate.entity';

export class CreateOrganizationMandateDto {
  @ApiProperty()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsString()
  mandateId: string;

  static fromDto(
    organizationMandateDto: CreateOrganizationMandateDto,
  ): OrganizationMandate {
    const organizationMandate: OrganizationMandate = new OrganizationMandate();
    if (!organizationMandateDto) {
      return;
    }
    organizationMandate.organizationId = organizationMandateDto.organizationId;

    organizationMandate.mandateId = organizationMandateDto.mandateId;

    return organizationMandate;
  }

  static fromDtos(organizationMandateDto: CreateOrganizationMandateDto[]) {
    return organizationMandateDto?.map((organizationMandate) =>
      CreateOrganizationMandateDto.fromDto(organizationMandate),
    );
  }
}

export class UpdateOrganizationMandateDto extends CreateOrganizationMandateDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(
    organizationMandateDto: UpdateOrganizationMandateDto,
  ): OrganizationMandate {
    const organizationMandate: OrganizationMandate = new OrganizationMandate();
    if (!organizationMandateDto) {
      return;
    }
    organizationMandate.id = organizationMandateDto.id;

    organizationMandate.organizationId = organizationMandateDto.organizationId;

    organizationMandate.mandateId = organizationMandateDto.mandateId;

    return organizationMandate;
  }
}

export class OrganizationMandateResponseDto extends UpdateOrganizationMandateDto {
  static toDto(
    organizationMandate: OrganizationMandate,
  ): OrganizationMandateResponseDto {
    const organizationMandateDto: OrganizationMandateResponseDto =
      new OrganizationMandateResponseDto();

    organizationMandateDto.id = organizationMandate.id;

    organizationMandateDto.organizationId = organizationMandate.organizationId;

    organizationMandateDto.mandateId = organizationMandate.mandateId;

    return organizationMandateDto;
  }

  static toDtos(organizationMandates: OrganizationMandate[]) {
    return organizationMandates?.map((organizationMandate) =>
      OrganizationMandateResponseDto.toDto(organizationMandate),
    );
  }
}
