import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Step } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class StepService extends ExtraCrudService<Step> {
  constructor(
    @InjectRepository(Step)
    private readonly repositoryStep: Repository<Step>,
  ) {
    super(repositoryStep);
  }
}
