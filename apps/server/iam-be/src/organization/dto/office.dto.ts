import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Office } from '../entities/office.entity';

export class CreateOfficeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  location: string;

  static fromDto(officeDto: CreateOfficeDto): Office | null {
    const office: Office = new Office();
    if (!officeDto) {
      return null;
    }

    office.name = officeDto.name;

    office.code = officeDto.code;

    office.location = officeDto.location;

    return office;
  }

  static fromDtos(officeDto: CreateOfficeDto[]) {
    return officeDto?.map((office) => CreateOfficeDto.fromDto(office));
  }
}

export class UpdateOfficeDto extends CreateOfficeDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(officeDto: UpdateOfficeDto): Office | null {
    const office: Office = new Office();
    if (!officeDto) {
      return null;
    }

    office.id = officeDto.id;

    office.name = officeDto.name;

    office.code = officeDto.code;

    office.location = officeDto.location;

    return office;
  }
}

export class OfficeResponseDto extends UpdateOfficeDto {
  static toDto(office: Office): OfficeResponseDto | null {
    const officeDto: OfficeResponseDto = new OfficeResponseDto();
    if (!officeDto) {
      return null;
    }

    officeDto.id = office.id;

    officeDto.name = office.name;

    officeDto.code = office.code;

    officeDto.location = office.location;

    return officeDto;
  }

  static toDtos(offices: Office[]) {
    return offices?.map((office) => OfficeResponseDto.toDto(office));
  }
}
