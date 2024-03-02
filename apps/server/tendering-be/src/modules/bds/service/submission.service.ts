import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsSubmission } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsSubmissionService extends ExtraCrudService<BdsSubmission> {
  constructor(
    @InjectRepository(BdsSubmission)
    private readonly bdsSubmissionRepository: Repository<BdsSubmission>,
  ) {
    super(bdsSubmissionRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<BdsSubmission | undefined> {
    return await this.bdsSubmissionRepository.findOneBy({ tenderId });
  }
}
