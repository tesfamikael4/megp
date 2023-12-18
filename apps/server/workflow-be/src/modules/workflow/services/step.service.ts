import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '../../../shared/service';
import { Step } from '../../../entities';

@Injectable()
export class StepService extends ExtraCrudService<Step> {
  constructor(
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
  ) {
    super(repositoryStep);
  }
}
