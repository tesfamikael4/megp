import { ApiProperty } from '@nestjs/swagger';
import { CustomCategoryEntity } from '../entities/custom-category.entity';

export class CreateCustomCategoryDto {
  id: string;
  @ApiProperty()
  description: string;
  applicationId: string;

  static fromDto(dto: CreateCustomCategoryDto): CustomCategoryEntity {
    const entity = new CustomCategoryEntity();
    if (!dto) {
      return;
    }
    //   entity.id = dto.id;
    entity.applicationId = dto.applicationId;
    entity.description = dto.description;

    return entity;
  }
}
