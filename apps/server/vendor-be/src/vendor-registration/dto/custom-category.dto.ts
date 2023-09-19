import { ApiProperty } from '@nestjs/swagger';
import { CustomCategoryEntity } from '../entities/custom-category.entity';

export class CreateCustomCategoryDto {
  id: string;
  @ApiProperty()
  description: string;
  vendorId: string;

  static fromDto(dto: CreateCustomCategoryDto): CustomCategoryEntity {
    const entity = new CustomCategoryEntity();
    if (!dto) {
      return;
    }
    //   entity.id = dto.id;
    entity.vendorId = dto.vendorId;
    entity.description = dto.description;

    return entity;
  }
}
