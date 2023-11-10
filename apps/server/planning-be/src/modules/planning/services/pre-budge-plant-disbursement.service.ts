import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgePlantDisbursement } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgePlantDisbursementService extends ExtraCrudService<PreBudgePlantDisbursement> {
  constructor(
    @InjectRepository(PreBudgePlantDisbursement)
    private readonly repositoryPreBudgePlantDisbursement: Repository<PreBudgePlantDisbursement>,
  ) {
    super(repositoryPreBudgePlantDisbursement);
  }
}
