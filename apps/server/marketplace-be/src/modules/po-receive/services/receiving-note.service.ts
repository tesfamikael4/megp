import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  QueryConstructor,
} from 'megp-shared-be';
import { ReceivingNote } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class ReceivingNoteService extends ExtraCrudService<ReceivingNote> {
  constructor(
    @InjectRepository(ReceivingNote)
    private readonly receivingNoteRepository: Repository<ReceivingNote>,
  ) {
    super(receivingNoteRepository);
  }
  async getAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<ReceivingNote>(
      this.receivingNoteRepository,
      query,
    );
    const response = new DataResponseFormat<ReceivingNote>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
}
