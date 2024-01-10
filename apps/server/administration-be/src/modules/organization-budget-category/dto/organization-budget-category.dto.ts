import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class OrganizationBudgetCategoryCreateDto {
  @ApiProperty()
  @IsUUID()
  @IsArray()
  organizationId: string[];

  @ApiProperty()
  @IsUUID()
  budgetCategoryId: string;
}

export class OrganizationBudgetCategoryUpdateDto extends OrganizationBudgetCategoryCreateDto {}

export class BulkBudgetDto {
  @ApiProperty({
    isArray: true,
    type: () => OrganizationBudgetCategoryCreateDto,
  })
  @IsArray()
  budgetCategoryList: OrganizationBudgetCategoryCreateDto[];
}
