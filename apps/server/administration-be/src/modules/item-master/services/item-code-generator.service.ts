import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ItemCodeSequence } from 'src/entities/item-code-sequence';

@Injectable()
export class ItemCodeGeneratorService {
  constructor(
    @InjectRepository(ItemCodeSequence)
    private readonly repository: Repository<ItemCodeSequence>,
  ) {}

  public async generate(): Promise<string> {
    const item = this.repository.create({});
    const responseItem = await this.repository.insert(item);
    return responseItem.identifiers[0].id.padStart(5, '0');
  }
}
