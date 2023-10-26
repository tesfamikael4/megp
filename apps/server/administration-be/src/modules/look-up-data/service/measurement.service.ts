import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from 'src/entities/measurement.entity';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Repository } from 'typeorm';
@Injectable()
export class MeasurementService extends EntityCrudService<Measurement> {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementRepository: Repository<Measurement>,
  ) {
    super(measurementRepository);
  }
}
