import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionTechnicalTeamDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UpdateProcurementRequisitionTechnicalTeamDto extends CreateProcurementRequisitionTechnicalTeamDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
export class Officers {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateProcurementRequisitionTechnicalTeamsDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty({ type: () => Officers })
  officers: Officers[];
}
export class ProcurementRequisitionTechnicalTeamResponseDto extends UpdateProcurementRequisitionTechnicalTeamDto {}
