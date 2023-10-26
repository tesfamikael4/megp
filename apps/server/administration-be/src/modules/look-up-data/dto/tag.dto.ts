import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Tag } from 'src/entities/tag.entity';
export class CreateTagDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  shortName: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  static fromDto(dto: CreateTagDto): Tag {
    const entity = new Tag();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    return entity;
  }

  static fromDtos(dto: CreateTagDto[]): Tag[] {
    return dto?.map((d) => CreateTagDto.fromDto(d));
  }
}

export class UpdateTagDto extends CreateTagDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateTagDto): Tag {
    const entity = new Tag();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.createdAt = new Date();
    return entity;
  }
}
export class TagResponseDto extends UpdateTagDto {
  static fromEntity(entity: Tag): TagResponseDto {
    const response = new TagResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    return response;
  }
}
