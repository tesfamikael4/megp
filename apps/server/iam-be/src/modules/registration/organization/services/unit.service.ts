import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UnitService extends ExtraCrudService<Unit> {
  constructor(
    @InjectRepository(Unit)
    private readonly repositoryUnit: Repository<Unit>,
  ) {
    super(repositoryUnit);
  }
}
