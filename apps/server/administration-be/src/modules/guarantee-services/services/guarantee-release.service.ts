import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuaranteeRelease } from 'src/entities/guarantee-release.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class GuaranteeReleaseService extends ExtraCrudService<GuaranteeRelease> {
  constructor(
    @InjectRepository(GuaranteeRelease)
    private readonly releaseRepository: Repository<GuaranteeRelease>,
  ) {
    super(releaseRepository);
  }
}
