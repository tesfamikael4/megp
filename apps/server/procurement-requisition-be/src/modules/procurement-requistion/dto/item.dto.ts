import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { BudgetCodeDto } from 'src/shared/domain/budget-code.dto';
export class CreateItemDto {
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
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  measurement: string;

  @ApiProperty()
  classification: JSON;

  @ApiProperty({ type: BudgetCodeDto })
  @IsObject()
  budgetCode: BudgetCodeDto;

  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;
}

export class UpdateItemDto extends CreateItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ItemResponseDto extends UpdateItemDto {}
