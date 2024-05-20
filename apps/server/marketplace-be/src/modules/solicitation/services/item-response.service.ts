import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { SolItemResponse } from 'src/entities/sol-item-response.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SolItemResponseService extends ExtraCrudService<SolItemResponse> {
  constructor(
    @InjectRepository(SolItemResponse)
    private readonly rfxItemResponseRepository: Repository<SolItemResponse>,
  ) {
    super(rfxItemResponseRepository);
  }
}
