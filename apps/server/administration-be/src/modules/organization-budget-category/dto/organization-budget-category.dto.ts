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
