import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { POShipment } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class POShipmentService extends ExtraCrudService<POShipment> {
  constructor(
    @InjectRepository(POShipment)
    private readonly poShipmentRepository: Repository<POShipment>,
  ) {
    super(poShipmentRepository);
  }
}
