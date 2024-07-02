import { Controller } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController, EntityCrudOptions } from 'megp-shared-be';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder } from 'src/entities';
import { CreatePurchaseOrderDto } from '../dtos/purchase-order.dto';

const options: EntityCrudOptions = {
  createDto: CreatePurchaseOrderDto,
  updateDto: CreatePurchaseOrderDto,
};
@Controller('purchase-orders')
@ApiTags('PurchaseOrder')
@ApiBearerAuth()
export class PurchaseOrderController extends EntityCrudController<PurchaseOrder>(
  options,
) {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {
    super(purchaseOrderService);
  }
}
