import { Injectable } from '@nestjs/common';
import { ContractAllocatedItem } from '@entities';
import { ExtraCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractAllocatedItemsService extends ExtraCrudService<ContractAllocatedItem> {
  constructor(
    @InjectRepository(ContractAllocatedItem)
    private readonly contractItemRepository: Repository<ContractAllocatedItem>,
  ) {
    super(contractItemRepository);
  }
}
