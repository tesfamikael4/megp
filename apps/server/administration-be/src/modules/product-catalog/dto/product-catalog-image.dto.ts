import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FileUploadDto } from 'src/shared/min-io';
export class CreateProductCatalogImageDto {
  @ApiProperty()
  @IsUUID()
  productCatalogId: string;

  @ApiProperty({ isArray: false, type: () => FileUploadDto })
  fileInfo: FileUploadDto;
}

export class UpdateProductCatalogImageDto extends CreateProductCatalogImageDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProductCatalogImageResponseDto extends UpdateProductCatalogImageDto {}
