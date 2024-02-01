import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsJSON, IsString, IsUUID } from 'class-validator';
export class CreateProcurementMechanismDto {
  @ApiProperty()
  @IsUUID()
  annualProcurementPlanActivityId: string;

  @ApiProperty()
  @IsString()
  fundingSource: string;

  @ApiProperty()
  @IsString()
  procurementMethod: string;

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

export class UpdateProcurementMechanismDto extends CreateProcurementMechanismDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementMechanismResponseDto extends UpdateProcurementMechanismDto {}
