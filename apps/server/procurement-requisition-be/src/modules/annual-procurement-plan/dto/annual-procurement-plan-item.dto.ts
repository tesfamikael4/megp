import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateAnnualProcurementPlanItemDto {
  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  measurement: string;

  @ApiProperty()
  @IsString()
  classification: string;

  @ApiProperty()
  @IsString()
  uoM: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanActivityId: string;
}

export class UpdateAnnualProcurementPlanItemDto extends CreateAnnualProcurementPlanItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AnnualProcurementPlanItemResponseDto extends UpdateAnnualProcurementPlanItemDto {}
