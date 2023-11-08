import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { Repository } from 'typeorm';
@Injectable()
export class UnitOfMeasurementService extends ExtraCrudService<UnitOfMeasurement> {
    constructor(
        @InjectRepository(UnitOfMeasurement)
        private readonly uomRepository: Repository<UnitOfMeasurement>,
    ) {
        super(uomRepository);
    }
}
