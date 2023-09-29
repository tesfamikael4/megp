import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import { MandateResponseDto } from './mandate.dto';

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
    // if (!organizationMandateDto) {
    //   return;
    // }

    organizationMandate.mandateId = organizationMandateDto.mandateId;

    organizationMandate.organizationId = organizationMandateDto.organizationId;

    organizationMandate.mandateName = organizationMandateDto.mandateName;

    organizationMandate.isSingleAssignment =
      organizationMandateDto.isSingleAssignment;

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
  mandate: MandateResponseDto;
  static fromDto(
    organizationMandateDto: UpdateOrganizationMandateDto,
  ): OrganizationMandate {
    const organizationMandate: OrganizationMandate = new OrganizationMandate();
    // if (!organizationMandateDto) {
    //   return;
    // }
    organizationMandateDto.id = organizationMandate.id;

    organizationMandate.mandateId = organizationMandateDto.mandateId;

    organizationMandate.organizationId = organizationMandateDto.organizationId;

    organizationMandate.mandateName = organizationMandateDto.mandateName;

    organizationMandate.isSingleAssignment =
      organizationMandateDto.isSingleAssignment;

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

    organizationMandateDto.mandateName = organizationMandate.mandateName;

    organizationMandateDto.isSingleAssignment =
      organizationMandate.isSingleAssignment;
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
