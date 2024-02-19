import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsEnum, IsObject } from 'class-validator';
import { ProcurementApplication } from 'src/shared/domain';
import { BudgetCodeDto } from 'src/shared/domain/budget-code.dto';

export class CreateProcurementRequisitionDto {
  organization: JSON;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  procurementReference: string;

  @ApiProperty()
  userReference: string;

  @ApiProperty()
  budgetYear: any;

  @ApiProperty({ type: BudgetCodeDto })
  @IsObject()
  budgetCode: BudgetCodeDto;

  @ApiProperty()
  @IsEnum(ProcurementApplication, {
    message: `procurementApplication must be one of the following values:${ProcurementApplication.AUCTIONING},${ProcurementApplication.TENDERING}, ${ProcurementApplication.PURCHASING}`,
  })
  procurementApplication: ProcurementApplication;

  @ApiProperty()
  @IsNumber()
  totalEstimatedAmount: number;

  @ApiProperty({ default: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty()
  status: string;
}

export class UpdateProcurementRequisitionDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class ProcurementRequisitionResponseDto extends UpdateProcurementRequisitionDto {}
