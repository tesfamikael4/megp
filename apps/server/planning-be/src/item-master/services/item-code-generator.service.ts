import { InjectRepository } from '@nestjs/typeorm';
import { ItemCodeSequence } from '../entities/item-code-sequence';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

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
