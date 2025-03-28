import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateRfxProcurementMechanismsDto {
  @ApiProperty()
  @IsObject()
  PRProcurementMechanisms: any;
}

export class UpdateRfxProcurementMechanismsDto extends CreateRfxProcurementMechanismsDto {
  @ApiProperty()
  @IsString()
  id: string;
}
