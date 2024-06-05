import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateProductCatalogDeliveryDto {
  @ApiProperty()
  @IsUUID()
  productCatalogId: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  deliveryDays: number;

  @ApiProperty()
  quantity: number;
}

export class UpdateProductCatalogDeliveryDto extends CreateProductCatalogDeliveryDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProductCatalogDeliveryResponseDto extends UpdateProductCatalogDeliveryDto {}
