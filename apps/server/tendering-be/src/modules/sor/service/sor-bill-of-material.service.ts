import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SorBillOfMaterialService extends ExtraCrudService<SorBillOfMaterial> {
  constructor(
    @InjectRepository(SorBillOfMaterial)
    private readonly sorBillOfMaterialRepository: Repository<SorBillOfMaterial>,
  ) {
    super(sorBillOfMaterialRepository);
  }
}
