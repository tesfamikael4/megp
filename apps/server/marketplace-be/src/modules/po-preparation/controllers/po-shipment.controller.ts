import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { POShipment } from 'src/entities';
import {
  CreatePOShipmentDto,
  UpdatePOShipmentDto,
} from '../dtos/po-shipment.dto';
import { POShipmentService } from '../services/po-shipment.service';
const options: ExtraCrudOptions = {
  entityIdName: 'purchaseOrderId',
  createDto: CreatePOShipmentDto,
  updateDto: UpdatePOShipmentDto,
};

@ApiBearerAuth()
@Controller('po-shipments')
@ApiTags('POShipment')
export class POShipmentController extends ExtraCrudController<POShipment>(
  options,
) {
  constructor(private readonly shipmentService: POShipmentService) {
    super(shipmentService);
  }
}
