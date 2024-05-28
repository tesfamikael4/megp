import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/tender-item.entity';
import { ItemStatusEnum } from 'src/shared/enums/tender-status.enum';
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

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.ItemRepository.update(item.id, {
      status: ItemStatusEnum.CANCELED,
    });
  }
}
