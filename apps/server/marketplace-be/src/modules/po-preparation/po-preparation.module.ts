import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import {
  ItemAttachment,
  ItemBudgetSource,
  ItemShipment,
  POAttachment,
  POItem,
  POTerm,
  PurchaseOrder,
  POShipment,
} from 'src/entities';
import { UtilityModule } from 'src/utils/utils.module';
import { POItemController } from './controllers/po-item.controller';
import { POAttachmentController } from './controllers/po-attachment.controller';
import { POTermController } from './controllers/po-term.controller';
import { ItemShipmentController } from './controllers/item-shipment.controller';
import { ItemBudgetSourceController } from './controllers/item-budget-source.controller';
import { ItemAttachmentController } from './controllers/item-attachment.controller';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { PurchaseOrderService } from './services/purchase-order.service';
import { POItemService } from './services/po-item.service';
import { POAttachmentService } from './services/po-attachment.service';
import { POTermService } from './services/po-term.service';
import { ItemShipmentService } from './services/item-shipment.service';
import { ItemBudgetSourceService } from './services/item-budget-source.service';
import { ItemAttachmentService } from './services/item-attachment.service';
import { POShipmentController } from './controllers/po-shipment.controller';
import { POShipmentService } from './services/po-shipment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      POItem,
      POAttachment,
      POTerm,
      ItemShipment,
      ItemBudgetSource,
      ItemAttachment,
      POShipment,
    ]),
    MinIOModule,
    UtilityModule,
  ],
  controllers: [
    PurchaseOrderController,
    POItemController,
    POAttachmentController,
    POTermController,
    ItemShipmentController,
    ItemBudgetSourceController,
    ItemAttachmentController,
    POShipmentController,
  ],
  providers: [
    POItemService,
    POAttachmentService,
    POTermService,
    ItemShipmentService,
    ItemBudgetSourceService,
    ItemAttachmentService,
    PurchaseOrderService,
    POShipmentService,
  ],
  exports: [],
})
export class POPreparationModule {}
