import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqcPreliminaryExamination } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class EqcPreliminaryExaminationService extends ExtraCrudService<EqcPreliminaryExamination> {
  constructor(
    @InjectRepository(EqcPreliminaryExamination)
    private readonly eqcPreliminaryExaminationRepository: Repository<EqcPreliminaryExamination>,
  ) {
    super(eqcPreliminaryExaminationRepository);
  }
}
