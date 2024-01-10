import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class OrganizationBudgetCategoryCreateDto {
  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  budgetCategoryId: string[];
}

export class OrganizationBudgetCategoryUpdateDto extends OrganizationBudgetCategoryCreateDto {}

// export class BulkBudgetDto {
//   @ApiProperty({
//     isArray: true,
//     type: () => OrganizationBudgetCategoryCreateDto,
//   })
//   @IsArray()
//   budgetCategoryList: OrganizationBudgetCategoryCreateDto[];
// }
