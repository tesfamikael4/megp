import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { CategoryEntity } from '../entities/category.entity';

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

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(registrationDto: CreateCategoryDto): CategoryEntity {
    const entity = new CategoryEntity();
    if (!registrationDto) {
      return;
    }
    entity.code = registrationDto.code;
    entity.businessArea = registrationDto.businessArea;
    entity.description = registrationDto.description;
    // entity.createdBy=
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(registrationDtos: CreateCategoryDto[]): CategoryEntity[] {
    return registrationDtos?.map((regDto) => CreateCategoryDto.fromDto(regDto));
  }
}
export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(registrationDto: UpdateCategoryDto): CategoryEntity {
    const entity = new CategoryEntity();
    if (!registrationDto) {
      return;
    }
    entity.id = registrationDto.id;
    entity.code = registrationDto.code;
    entity.businessArea = registrationDto.businessArea;
    entity.description = registrationDto.description;
    entity.updatedAt = new Date();
    // entity.updatedBy=
    return entity;
  }
}
/*
CategoryResponseDto 
*/
export class CategoryResponseDto {
  id: string;
  code: string;
  description: string;
  businessArea: string;
  createdAt: Date;

  static fromEntity(dto: CategoryEntity): CategoryResponseDto {
    const response = new CategoryResponseDto();
    response.id = dto.id;
    response.code = dto.code;
    response.description = dto.description;
    response.businessArea = dto.businessArea;
    response.createdAt = dto.createdAt;

    return response;
  }
}
