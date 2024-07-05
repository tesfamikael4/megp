import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  CurrentUser,
  decodeCollectionQuery,
  ExtraCrudController,
} from 'megp-shared-be';
import { RFXItem } from 'src/entities';
import { RFXItemService } from '../services/rfx-items.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { query } from 'express';

@Controller('rfx-items')
@ApiTags('Rfx Items')
export class RFXItemController extends ExtraCrudController<RFXItem>({
  entityIdName: 'rfxId',
}) {
  constructor(private readonly rfxItemService: RFXItemService) {
    super(rfxItemService);
  }

  @Get('vendor-registries/:vendorId/:rfxId')
  async vendorRegistries(
    @Param('vendorId') vendorId: string,
    @Param('rfxId') rfxId: string,
  ) {
    return await this.rfxItemService.vendorRegistries(vendorId, rfxId);
  }

  @Get('my-awarded-items/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async myAwardedItems(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxItemService.myAwardItems(rfxId, user, query);
  }
}
