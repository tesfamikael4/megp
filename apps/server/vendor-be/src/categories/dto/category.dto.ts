import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Category } from '../entities/category';

export class CreateCategoryDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty({ enum: ['Goods', 'Services', 'Works'] })
  @IsNotEmpty()
  businessArea: string;
  @ApiProperty()
  parentId: string;

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(registrationDto: CreateCategoryDto): Category {
    const entity = new Category();
    if (!registrationDto) {
      return;
    }
    entity.code = registrationDto.code;
    entity.businessArea = registrationDto.businessArea;
    entity.description = registrationDto.description;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(registrationDtos: CreateCategoryDto[]): Category[] {
    return registrationDtos?.map((regDto) => CreateCategoryDto.fromDto(regDto));
  }
}
export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(registrationDto: UpdateCategoryDto): Category {
    const entity = new Category();
    if (!registrationDto) {
      return;
    }
    entity.id = registrationDto.id;
    entity.code = registrationDto.code;
    entity.businessArea = registrationDto.businessArea;
    entity.description = registrationDto.description;

    // entity.updatedBy=
    return entity;
  }
}
/*
CategoryResponseDto 
*/
export class CategoryResponseDto extends UpdateCategoryDto {
  createdAt: Date;

  static fromEntity(dto: Category): CategoryResponseDto {
    const response = new CategoryResponseDto();
    response.id = dto.id;
    response.code = dto.code;
    response.description = dto.description;
    response.businessArea = dto.businessArea;

    return response;
  }
}
