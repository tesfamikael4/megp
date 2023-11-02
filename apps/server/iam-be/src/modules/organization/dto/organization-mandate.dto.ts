import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrganizationMandate } from '@entities';
import { MandateResponseDto } from '../../mandate/dto/mandate.dto';

export class CreateOrganizationMandateDto {
  @ApiProperty()
  @IsUUID()
  mandateId: string;
  @ApiProperty()
  @IsUUID()
  organizationId: string;
  @ApiProperty()
  @IsString()
  mandateName: string;
  @ApiProperty()
  @IsBoolean()
  isSingleAssignment: boolean;

  static fromDto(
    organizationMandateDto: CreateOrganizationMandateDto,
  ): OrganizationMandate {
    const organizationMandate: OrganizationMandate = new OrganizationMandate();
    organizationMandate.mandateId = organizationMandateDto.mandateId;

    organizationMandate.organizationId = organizationMandateDto.organizationId;

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
  @IsOptional()
  id: string;
  mandate: MandateResponseDto;
  static fromDto(
    organizationMandateDto: UpdateOrganizationMandateDto,
  ): OrganizationMandate {
    const organizationMandate: OrganizationMandate = new OrganizationMandate();
    organizationMandateDto.id = organizationMandate.id;

    organizationMandate.mandateId = organizationMandateDto.mandateId;

    organizationMandate.organizationId = organizationMandateDto.organizationId;

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

    organizationMandateDto.mandateId = organizationMandate.mandateId;

    organizationMandateDto.organizationId = organizationMandate.organizationId;

    if (organizationMandate.mandate) {
      organizationMandateDto.mandate = MandateResponseDto.toDto(
        organizationMandate.mandate,
      );
    }

    return organizationMandateDto;
  }

  static toDtos(organizationMandates: OrganizationMandate[]) {
    return organizationMandates?.map((organizationMandate) =>
      OrganizationMandateResponseDto.toDto(organizationMandate),
    );
  }
}
