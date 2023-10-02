import { ApiProperty } from '@nestjs/swagger';
import { BusinessCategoryEntity } from '../entities/business-category.entity';
export class CreateBusinessCategoryDto {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  vendorId: string;
  @ApiProperty()
  categoryName: string;
  static fromDto(dto: CreateBusinessCategoryDto): BusinessCategoryEntity {
    const entity = new BusinessCategoryEntity();
    if (!dto) {
      return;
    }
    //   entity.id = dto.id;
    entity.vendorId = dto.vendorId;
    entity.categoryId = dto.categoryId;
    return entity;
  }
}
export class BusinessCategoryResponseDto extends CreateBusinessCategoryDto {
  id: string;
  static toResponse(
    entity: BusinessCategoryEntity,
  ): BusinessCategoryResponseDto {
    const response = new BusinessCategoryResponseDto();
    response.id = entity.id;
    response.categoryId = entity.categoryId;
    response.vendorId = entity.vendorId;
    if (entity.category) {
      response.categoryName = entity.category.description;
    }
    return response;
  }
}
