import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateTechnicalTeamDto {
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

export class UpdateTechnicalTeamDto extends CreateTechnicalTeamDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class TechnicalTeamResponseDto extends UpdateTechnicalTeamDto {}
