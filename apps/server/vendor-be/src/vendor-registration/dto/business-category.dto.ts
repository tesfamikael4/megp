import { ApiProperty } from '@nestjs/swagger';
import { BusinessCategoryEntity } from '../entities/business-category.entity';
export class CreateBusinessCategoryDto {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  vendorId: string;

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
  static fromEntity(
    regDto: BusinessCategoryEntity,
  ): BusinessCategoryResponseDto {
    const response = new BusinessCategoryResponseDto();
    response.id = regDto.id;
    response.categoryId = regDto.categoryId;
    response.vendorId = regDto.vendorId;
    return response;
  }
}
