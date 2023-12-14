import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Region } from 'src/entities/region.entity';

export class CreateRegionDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  static fromDto(dto: CreateRegionDto): Region {
    const entity = new Region();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    return entity;
  }

  static fromDtos(dto: CreateRegionDto[]): Region[] {
    return dto?.map((d) => CreateRegionDto.fromDto(d));
  }
}

export class UpdateRegionDto extends CreateRegionDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateRegionDto): Region {
    const entity = new Region();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.createdAt = new Date();
    return entity;
  }
}
export class RegionResponseDto extends UpdateRegionDto {
  static fromEntity(entity: Region): RegionResponseDto {
    const response = new RegionResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    return response;
  }
}
