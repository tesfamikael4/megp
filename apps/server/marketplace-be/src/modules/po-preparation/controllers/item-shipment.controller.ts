import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ItemShipment } from 'src/entities';
import { ItemShipmentService } from '../services/item-shipment.service';
import {
  CreateBulkItemShipmentDto,
  CreateItemShipmentDto,
  UpdateItemShipmentDto,
} from '../dtos/item-shipment.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'poShipmentId',
  createDto: CreateItemShipmentDto,
  updateDto: UpdateItemShipmentDto,
};

@ApiBearerAuth()
@Controller('item-shipments')
@ApiTags('ItemShipment')
export class ItemShipmentController extends ExtraCrudController<ItemShipment>(
  options,
) {
  constructor(private readonly itemShipmentService: ItemShipmentService) {
    super(itemShipmentService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() itemData: any) {
    return await this.itemShipmentService.bulkCreate(itemData);
  }
}
