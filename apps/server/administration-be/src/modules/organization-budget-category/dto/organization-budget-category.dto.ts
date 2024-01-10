import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class OrganizationBudgetCategoryDto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  name: string;
}

export class OrganizationBudgetCategoryCreateDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class OrganizationBudgetCategoryUpdateDto extends OrganizationBudgetCategoryCreateDto {}
