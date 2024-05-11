import { IsObject, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCatalogueDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsObject()
  vendor: any;

  @ApiProperty()
  @IsObject()
  specificationValues: any;

  @ApiProperty()
  @IsObject()
  deliveryValues: any;

  @ApiProperty()
  @IsObject()
  productCatalogImages: any;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
