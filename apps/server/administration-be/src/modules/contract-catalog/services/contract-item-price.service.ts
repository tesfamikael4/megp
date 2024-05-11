import { Injectable } from '@nestjs/common';
import { ContractItem } from '@entities';
import { ExtraCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractItemsService extends ExtraCrudService<ContractItem> {
  constructor(
    @InjectRepository(ContractItem)
    private readonly contractItemRepository: Repository<ContractItem>,
  ) {
    super(contractItemRepository);
  }
}
