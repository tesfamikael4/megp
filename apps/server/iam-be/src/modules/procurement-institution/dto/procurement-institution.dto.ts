import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProcurementInstitutionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}

export class UpdateProcurementInstitutionDto extends CreateProcurementInstitutionDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class ProcurementInstitutionDto extends UpdateProcurementInstitutionDto {}
