import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccGuarantee } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccGuaranteeService extends ExtraCrudService<SccGuarantee> {
  constructor(
    @InjectRepository(SccGuarantee)
    private readonly sccGuaranteeRepository: Repository<SccGuarantee>,
  ) {
    super(sccGuaranteeRepository);
  }
}
