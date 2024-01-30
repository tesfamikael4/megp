import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsJSON, IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionMechanismDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsString()
  fundingSource: string;

  @ApiProperty()
  @IsString()
  ProcurementMethod: string;

  @ApiProperty()
  @IsString()
  procurementType: string;

  @ApiProperty()
  @IsArray()
  donor: string[];

  @ApiProperty()
  @IsArray()
  targetGroup: string[];

  @ApiProperty()
  @IsBoolean()
  isOnline: boolean;

  @ApiProperty()
  @IsJSON()
  contract: JSON;
}

export class UpdateProcurementRequisitionMechanismDto extends CreateProcurementRequisitionMechanismDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionMechanismResponseDto extends UpdateProcurementRequisitionMechanismDto {}
