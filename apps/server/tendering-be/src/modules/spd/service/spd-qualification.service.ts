import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SpdQualification } from 'src/entities';

@Injectable()
export class SpdQualificationService extends ExtraCrudService<SpdQualification> {
  constructor(
    @InjectRepository(SpdQualification)
    private readonly spdQualificationRepository: Repository<SpdQualification>,
  ) {
    super(spdQualificationRepository);
  }
}
