import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  QueryConstructor,
} from 'megp-shared-be';
import { AcceptanceNote } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class AcceptanceNoteService extends ExtraCrudService<AcceptanceNote> {
  constructor(
    @InjectRepository(AcceptanceNote)
    private readonly acceptanceNoteRepository: Repository<AcceptanceNote>,
  ) {
    super(acceptanceNoteRepository);
  }
  async getAll(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<AcceptanceNote>(
      this.acceptanceNoteRepository,
      query,
    );
    const response = new DataResponseFormat<AcceptanceNote>();
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
