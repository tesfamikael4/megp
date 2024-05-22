import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { SpecificationTemplatesService } from '../services/specification-template.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { SpecificationTemplate } from '@entities';
import { EntityCrudController } from '@generic-controllers';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {};
@Controller('specification-templates')
@ApiTags('specification-templates')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class SpecificationTemplatesController extends EntityCrudController<SpecificationTemplate>(
  options,
) {
  constructor(
    private readonly specificationTemplateService: SpecificationTemplatesService,
  ) {
    super(specificationTemplateService);
  }

  @Post('copy-template')
  @ApiBody({ type: SpecificationTemplate })
  async copy(
    @Body() data: any,
    @Req() req?: any,
  ): Promise<SpecificationTemplate> {
    return this.specificationTemplateService.copy(data, req);
  }

  @Get('unused-item-masters')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getItems(@Query('q') q: string): Promise<SpecificationTemplate> {
    const query = decodeCollectionQuery(q);
    return this.specificationTemplateService.getItems(query);
  }

  @Get('item/:itemMasterId')
  async getByItem(
    @Param('itemMasterId') itemMasterId: string,
  ): Promise<SpecificationTemplate> {
    return this.specificationTemplateService.getByItem(itemMasterId);
  }
  @Get('itemCode/:itemMasterCode')
  async getByItemCode(
    @Param('itemMasterCode') itemMasterCode: string,
  ): Promise<SpecificationTemplate> {
    return this.specificationTemplateService.getByItemCode(itemMasterCode);
  }
}
