import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Reason } from 'src/entities/reason.entity';

@Injectable()
export class ReasonService extends EntityCrudService<Reason> {
  constructor(
    @InjectRepository(Reason)
    private readonly repositoryReason: Repository<Reason>,
  ) {
    super(repositoryReason);
  }
}
