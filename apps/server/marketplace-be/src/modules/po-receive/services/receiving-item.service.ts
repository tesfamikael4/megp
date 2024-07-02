import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { ReceivingItem } from 'src/entities';

import { In, Repository } from 'typeorm';
import { AcceptanceItemService } from './acceptance-item.service';

@Injectable()
export class ReceivingItemService extends ExtraCrudService<ReceivingItem> {
  constructor(
    @InjectRepository(ReceivingItem)
    private readonly receivingItemRepository: Repository<ReceivingItem>,
    private readonly acceptanceItemService: AcceptanceItemService,
  ) {
    super(receivingItemRepository);
  }
  async findAlls(ids: string[], acceptanceNoteId: string) {
    const items = await this.receivingItemRepository.find({
      where: { receivingNoteId: In(ids) },
    });
    await this.acceptanceItemService.buckCreate(items, acceptanceNoteId);
  }
}
