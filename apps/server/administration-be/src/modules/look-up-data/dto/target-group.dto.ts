import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Currency } from 'src/entities/currency.entity';
import { TargetGroup } from 'src/entities/target-group.entity';

export class CreateTargetGroupDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  static fromDto(dto: CreateTargetGroupDto): TargetGroup {
    const entity = new TargetGroup();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static fromDtos(dto: CreateTargetGroupDto[]): TargetGroup[] {
    return dto?.map((d) => CreateTargetGroupDto.fromDto(d));
  }
}

export class UpdateTargetGroupDto extends CreateTargetGroupDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateTargetGroupDto): TargetGroup {
    const entity = new TargetGroup();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.createdAt = new Date();
    return entity;
  }
}
export class TargetGroupResponseDto extends UpdateTargetGroupDto {
  static fromEntity(entity: Currency): TargetGroupResponseDto {
    const response = new TargetGroupResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    return response;
  }
}
