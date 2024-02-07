import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateSpdAdministrativeCompliancesDto {
  @ApiProperty()
  @IsUUID()
  spdId: string;

  @ApiProperty()
  @IsString()
  itbDescription: string;

  @ApiProperty()
  @IsString()
  attribute: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  mandate: string;

  @ApiProperty()
  @IsString()
  order: number;

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean;
}

export class UpdateSpdAdministrativeCompliancesDto extends CreateSpdAdministrativeCompliancesDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AdministrativeComplianceResponseDto extends UpdateSpdAdministrativeCompliancesDto {}
