import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrganizationSector } from '../entities/organization-sector.entity';

export class CreateOrganizationSectorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  static fromDto(
    organizationSectorDto: CreateOrganizationSectorDto,
  ): OrganizationSector {
    const organizationSector: OrganizationSector = new OrganizationSector();

    organizationSector.name = organizationSectorDto.name;

    organizationSector.description = organizationSectorDto.description;

    return organizationSector;
  }

  static fromDtos(organizationSectorDto: CreateOrganizationSectorDto[]) {
    return organizationSectorDto?.map((organizationSector) =>
      CreateOrganizationSectorDto.fromDto(organizationSector),
    );
  }
}

export class UpdateOrganizationSectorDto extends CreateOrganizationSectorDto {
  id: string;

  static fromDto(
    organizationSectorDto: UpdateOrganizationSectorDto,
  ): OrganizationSector {
    const organizationSector: OrganizationSector = new OrganizationSector();

    organizationSector.id = organizationSectorDto.id;

    organizationSector.name = organizationSectorDto.name;

    organizationSector.description = organizationSectorDto.description;

    return organizationSector;
  }
}

export class OrganizationSectorResponseDto extends UpdateOrganizationSectorDto {
  static toDto(
    organizationSector: OrganizationSector,
  ): OrganizationSectorResponseDto {
    const organizationSectorDto: OrganizationSectorResponseDto =
      new OrganizationSectorResponseDto();

    organizationSectorDto.id = organizationSector.id;

    organizationSectorDto.name = organizationSector.name;

    organizationSectorDto.description = organizationSector.description;

    return organizationSectorDto;
  }

  static toDtos(organizationSectors: OrganizationSector[]) {
    return organizationSectors?.map((organizationSector) =>
      OrganizationSectorResponseDto.toDto(organizationSector),
    );
  }
}
