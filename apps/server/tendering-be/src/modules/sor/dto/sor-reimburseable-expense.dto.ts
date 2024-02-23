import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateSorReimburseableExpenseDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  itemNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  unitCost: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cost: number;
}

export class UpdateSorReimburseableExpenseDto extends CreateSorReimburseableExpenseDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorReimburseableExpenseResponseDto extends UpdateSorReimburseableExpenseDto {}
