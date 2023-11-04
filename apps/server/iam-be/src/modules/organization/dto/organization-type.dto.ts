import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrganizationType } from '@entities';

export class CreateOrganizationTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  static fromDto(
    organizationTypeDto: CreateOrganizationTypeDto,
  ): OrganizationType {
    const organizationType: OrganizationType = new OrganizationType();

    organizationType.name = organizationTypeDto.name;

    organizationType.description = organizationTypeDto.description;

    return organizationType;
  }

  static fromDtos(organizationTypeDto: CreateOrganizationTypeDto[]) {
    return organizationTypeDto?.map((organizationType) =>
      CreateOrganizationTypeDto.fromDto(organizationType),
    );
  }
}

export class UpdateOrganizationTypeDto extends CreateOrganizationTypeDto {
  id: string;

  static fromDto(
    organizationTypeDto: UpdateOrganizationTypeDto,
  ): OrganizationType {
    const organizationType: OrganizationType = new OrganizationType();

    organizationType.id = organizationTypeDto.id;

    organizationType.name = organizationTypeDto.name;

    organizationType.description = organizationTypeDto.description;

    return organizationType;
  }
}

export class OrganizationTypeResponseDto extends UpdateOrganizationTypeDto {
  static toDto(
    organizationType: OrganizationType,
  ): OrganizationTypeResponseDto {
    const organizationTypeDto: OrganizationTypeResponseDto =
      new OrganizationTypeResponseDto();

    organizationTypeDto.id = organizationType.id;

    organizationTypeDto.name = organizationType.name;

    organizationTypeDto.description = organizationType.description;

    return organizationTypeDto;
  }

  static toDtos(organizationTypes: OrganizationType[]) {
    return organizationTypes?.map((organizationType) =>
      OrganizationTypeResponseDto.toDto(organizationType),
    );
  }
}
