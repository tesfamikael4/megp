import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService extends ExtraCrudService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly ItemRepository: Repository<Item>,
  ) {
    super(ItemRepository);
  }
}
