import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateSorTechnicalRequirementDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sorType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  requirement: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  requirementCondition: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  requirementType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formLink: string;
}

export class UpdateSorTechnicalRequirementDto extends CreateSorTechnicalRequirementDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorTechnicalRequirementResponseDto extends UpdateSorTechnicalRequirementDto {}
