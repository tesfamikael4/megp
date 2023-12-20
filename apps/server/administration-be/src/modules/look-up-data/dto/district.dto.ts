import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { District } from 'src/entities/district.entity';

export class CreateDistrictDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  regionId: string;

  static fromDto(dto: CreateDistrictDto): District {
    const entity = new District();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.regionId = dto.regionId;
    return entity;
  }

  static fromDtos(dto: CreateDistrictDto[]): District[] {
    return dto?.map((d) => CreateDistrictDto.fromDto(d));
  }
}

export class UpdateDistrictDto extends CreateDistrictDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateDistrictDto): District {
    const entity = new District();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.regionId = dto.regionId;
    entity.createdAt = new Date();
    return entity;
  }
}
export class DistrictResponseDto extends UpdateDistrictDto {
  static fromEntity(entity: District): DistrictResponseDto {
    const response = new DistrictResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.regionId = entity.regionId;
    return response;
  }
}
