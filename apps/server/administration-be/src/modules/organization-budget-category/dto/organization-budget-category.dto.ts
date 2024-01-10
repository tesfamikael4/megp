import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class OrganizationBudgetCategoryCreateDto {
  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsUUID()
  budgetCategoryId: string;
}

export class OrganizationBudgetCategoryUpdateDto extends OrganizationBudgetCategoryCreateDto {}
