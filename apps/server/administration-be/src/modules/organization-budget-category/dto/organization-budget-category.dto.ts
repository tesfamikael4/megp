import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class OrganizationBudgetCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  organizationName: string;

  @ApiProperty()
  @IsUUID()
  budgetCategoryId: string;
}

export class OrganizationBudgetCategoryCreateDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class OrganizationBudgetCategoryUpdateDto extends OrganizationBudgetCategoryCreateDto {}
