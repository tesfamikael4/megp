import { IsString, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxOpenProductDto {
  @ApiProperty()
  @IsString()
  rfxItemId: string;

  @ApiProperty()
  @IsArray()
  productCatalogueIds: string[];

  @ApiProperty()
  @IsObject()
  catalogueSpecificationValues: any;

  @ApiProperty()
  @IsObject()
  catalogueDeliveryValues: any;

  @ApiProperty()
  @IsObject()
  vendorMetadata: any;
}

export class UpdateRfxOpenProductDto extends CreateRfxOpenProductDto {
  @ApiProperty()
  @IsString()
  id: string;
}
