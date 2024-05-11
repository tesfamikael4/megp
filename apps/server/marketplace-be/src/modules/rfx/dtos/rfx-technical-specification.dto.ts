import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsUUID } from 'class-validator';

export class CreateRfxTechnicalSpecificationDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsObject()
  deliverySpecification: string;

  @ApiProperty()
  @IsObject()
  technicalSpecification: any;
}

export class UpdateRfxTechnicalSpecificationDto extends CreateRfxTechnicalSpecificationDto {
  @ApiProperty()
  @IsString()
  id: string;
}
