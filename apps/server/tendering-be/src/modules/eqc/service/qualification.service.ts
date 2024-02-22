import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqcQualification } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class EqcQualificationService extends ExtraCrudService<EqcQualification> {
  constructor(
    @InjectRepository(EqcQualification)
    private readonly eqcQualificationRepository: Repository<EqcQualification>,
  ) {
    super(eqcQualificationRepository);
  }
}
