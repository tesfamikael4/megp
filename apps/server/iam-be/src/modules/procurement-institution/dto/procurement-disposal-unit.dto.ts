import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProcurementDisposalUnitDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  procurementInstitutionId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
export class UpdateProcurementDisposalUnitDto extends CreateProcurementDisposalUnitDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementDisposalUnitDto extends UpdateProcurementDisposalUnitDto {}
