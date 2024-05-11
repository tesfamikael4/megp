import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRfxProcurementTechnicalTeamDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsBoolean()
  isTeamLead: boolean;
}

export class UpdateRfxProcurementTechnicalTeamDto extends CreateRfxProcurementTechnicalTeamDto {
  @ApiProperty()
  @IsString()
  id: string;
}
