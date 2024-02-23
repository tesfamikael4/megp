import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SorEquipment } from 'src/entities/sor-equipment.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SorEquipmentService extends ExtraCrudService<SorEquipment> {
  constructor(
    @InjectRepository(SorEquipment)
    private readonly sorEquipmentRepository: Repository<SorEquipment>,
  ) {
    super(sorEquipmentRepository);
  }
}
