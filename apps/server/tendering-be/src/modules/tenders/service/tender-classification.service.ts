import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TenderClassification } from 'src/entities/tender-classification.entity';

@Injectable()
export class TenderClassificationService extends ExtraCrudService<TenderClassification> {
  constructor(
    @InjectRepository(TenderClassification)
    private readonly spdContractFormRepository: Repository<TenderClassification>,
  ) {
    super(spdContractFormRepository);
  }
}
