import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { ProcurementApplication } from 'src/shared/domain';

export class CreateProcurementRequisitionDto {
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
  budgetId: string;

  @ApiProperty()
  isMultiYear: boolean;
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
