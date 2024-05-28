import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ExtraCrudController } from 'megp-shared-be';
import { RFXItem } from 'src/entities';
import { RFXItemService } from '../services/rfx-items.service';
import { ApiTags } from '@nestjs/swagger';

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
}
