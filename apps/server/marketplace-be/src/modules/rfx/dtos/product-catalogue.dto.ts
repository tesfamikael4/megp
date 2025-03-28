import { IsObject, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCatalogueDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  vendorId: any;

  @ApiProperty()
  @IsString()
  vendorName: any;

  @ApiProperty()
  @IsObject()
  specifications: any;

  @ApiProperty()
  @IsObject()
  productCatalogDeliveries: any;

  @ApiProperty()
  @IsObject()
  productCatalogImages: any;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
