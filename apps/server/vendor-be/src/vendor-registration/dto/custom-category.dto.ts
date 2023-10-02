import { ApiProperty } from '@nestjs/swagger';
import { CustomCategoryEntity } from '../entities/custom-category.entity';

export class CreateCustomCategoryDto {
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  vendorId: string;

  static fromDto(dto: CreateCustomCategoryDto): CustomCategoryEntity {
    const entity = new CustomCategoryEntity();
    if (!dto) {
      return;
    }
    entity.vendorId = dto.vendorId;
    entity.description = dto.description;

    return entity;
  }
}
export class CustomCategoryResponseDto extends CreateCustomCategoryDto {
  @ApiProperty()
  id: string;
  static toResponse(entity: CustomCategoryEntity): CustomCategoryResponseDto {
    const response = new CustomCategoryResponseDto();
    if (!entity) {
      return;
    }
    response.id = entity.id;
    response.vendorId = entity.vendorId;
    response.description = entity.description;

    return response;
  }
}
