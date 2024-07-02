import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCrudService } from 'megp-shared-be';
import { PurchaseOrder } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseOrderService extends EntityCrudService<PurchaseOrder> {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {
    super(purchaseOrderRepository);
  }
}
