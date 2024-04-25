import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProductCatalogImage } from 'src/entities';
import { CurrentUser } from 'src/shared/authorization';
import {
  CreateProductCatalogImageDto,
  UpdateProductCatalogImageDto,
} from '../dto/product-catalog-image.dto';
import { ProductCatalogImageService } from '../services/product-catalog-image.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProductCatalogImageDto,
  updateDto: UpdateProductCatalogImageDto,
};

@Controller('product-catalog-images')
@ApiTags('product-catalog-images')
export class ProductCatalogImageController extends ExtraCrudController<ProductCatalogImage>(
  options,
) {
  constructor(
    private readonly productCatalogImageService: ProductCatalogImageService,
  ) {
    super(productCatalogImageService);
  }
  @Post('upload')
  async upload(@CurrentUser() user: any, @Body() fileInfo: any) {
    return await this.productCatalogImageService.upload(user, fileInfo);
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string) {
    return await this.productCatalogImageService.download(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.productCatalogImageService.generatePresignedGetUrl(id);
  }
}
