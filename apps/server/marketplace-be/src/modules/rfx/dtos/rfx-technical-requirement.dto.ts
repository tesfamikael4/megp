import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRfxTechnicalRequirementDto {
  @ApiProperty()
  @IsUUID()
  rfxItemId: string;

  @ApiProperty()
  @IsObject()
  technicalSpecification: any;

  @ApiProperty()
  @IsObject()
  deliverySpecification: any;
}

export class UpdateRfxTechnicalRequirementDto extends CreateRfxTechnicalRequirementDto {
  @ApiProperty()
  @IsString()
  id: string;
}
