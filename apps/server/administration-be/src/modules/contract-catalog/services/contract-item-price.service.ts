import { Injectable } from '@nestjs/common';
import { ContractItemPrice } from '@entities';
import { ExtraCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractItemPricesService extends ExtraCrudService<ContractItemPrice> {
  constructor(
    @InjectRepository(ContractItemPrice)
    private readonly contractItemPriceRepository: Repository<ContractItemPrice>,
  ) {
    super(contractItemPriceRepository);
  }
}
