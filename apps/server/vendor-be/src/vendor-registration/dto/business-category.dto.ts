import { ApiProperty } from '@nestjs/swagger';
import { BusinessCategoryEntity } from '../entities/business-category.entity';
export class CreateBusinessCategoryDto {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  ApplicationId: string;

  static fromDto(dto: CreateBusinessCategoryDto): BusinessCategoryEntity {
    const entity = new BusinessCategoryEntity();
    if (!dto) {
      return;
    }
    //   entity.id = dto.id;
    entity.applicationId = dto.ApplicationId;
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
    response.ApplicationId = regDto.applicationId;
    return response;
  }
}
